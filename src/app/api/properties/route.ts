import { NextRequest, NextResponse } from "next/server";

import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { propertyCreateFormSchema } from "@/validations/properties";
import { createProperty } from "@/actions/properties";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const body = cookies().get(`create-${id}`);

  if (!id || !body)
    return new NextResponse("Property not found", { status: 404 });

  const { ...jsonBody } = JSON.parse(body?.["value"]);
  const parsedData = propertyCreateFormSchema.safeParse(jsonBody);

  if (!parsedData.success) throw new Error("Invalid data in GET");

  const stream = new ReadableStream({
    async start(controller) {
      createProperty(controller, parsedData?.["data"]).then((_) => {
        cookies().delete(`create-${id}`);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedData = propertyCreateFormSchema.safeParse(body);

  if (!parsedData.success)
    return new NextResponse("Invalid data in POST", { status: 400 });

  const id = generateIdFromEntropySize(10);
  cookies().set(`create-${id}`, JSON.stringify(parsedData.data));

  return new NextResponse(JSON.stringify({ id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
