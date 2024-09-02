import { NextRequest, NextResponse } from "next/server";

import { postCreateSchema } from "@/validations/posts";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { createPost } from "@/actions/posts";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const body = cookies().get(`create-${id}`);

  if (!id || !body)
    return new NextResponse("Project not found", { status: 404 });

  const { ...jsonBody } = JSON.parse(body?.["value"]);
  const parsedData = postCreateSchema.safeParse(jsonBody);

  if (!parsedData.success) throw new Error("Invalid data in GET");

  const stream = new ReadableStream({
    async start(controller) {
      createPost(controller, parsedData?.["data"]).then((_) => {
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
  const parsedData = postCreateSchema.safeParse(body);

  if (!parsedData.success)
    return new NextResponse("Invalid data in POST", { status: 400 });

  const id = generateIdFromEntropySize(10);
  cookies().set(`create-${id}`, JSON.stringify(parsedData.data));

  return new NextResponse(JSON.stringify({ id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
