import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPost } from "@/actions/posts";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return new NextResponse("Invalid request", { status: 400 });

  try {
    const stream = new ReadableStream({
      async start(controller) {
        await createPost(controller, key);
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Failed to start stream:", error);
    return new NextResponse("Server error", { status: 500 });
  } finally {
    cookies().delete(key);
  }
}
