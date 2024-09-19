import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return new NextResponse("Study Case not found", { status: 404 });

  const stream = new ReadableStream({
    async start(controller) {
      // createCaseStudy(controller, key).finally(() => {
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
