import { createProperty } from "@/actions/properties";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return new NextResponse("Property not found", { status: 404 });

  const stream = new ReadableStream({
    async start(controller) {
      createProperty(controller, key).finally(() => {
        cookies().delete(key);
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
