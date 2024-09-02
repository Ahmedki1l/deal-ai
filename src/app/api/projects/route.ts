import { NextRequest, NextResponse } from "next/server";

import { projectCreateFormSchema } from "@/validations/projects";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { createProject } from "@/actions/projects";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const body = cookies().get(`create-${projectId}`);

  if (!projectId || !body)
    return new NextResponse("Project not found", { status: 404 });

  const parsedData = projectCreateFormSchema.safeParse(
    JSON.parse(body?.["value"])?.[projectId],
  );

  if (!parsedData.success) throw new Error("Invalid data in GET");

  const stream = new ReadableStream({
    async start(controller) {
      createProject(controller, parsedData?.["data"]).then((_) => {
        cookies().delete(`create-${projectId}`);
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
  const parsedData = projectCreateFormSchema.safeParse(body);

  if (!parsedData.success) {
    return new NextResponse("Invalid data in POST", { status: 400 });
  }

  const projectId = generateIdFromEntropySize(10);
  const projectDataStore: Record<string, any> = {};

  projectDataStore[projectId] = parsedData.data; // Store data in memory
  cookies().set(`create-${projectId}`, JSON.stringify(projectDataStore));

  return new NextResponse(JSON.stringify({ projectId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
