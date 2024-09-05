import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPost } from "@/actions/posts";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return new NextResponse("Post not found", { status: 404 });

  const stream = new ReadableStream({
    async start(controller) {
      // createPost(controller, key).finally(() => {
      //   cookies().delete(key);
      // });
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
