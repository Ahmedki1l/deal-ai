export function sendEvent(
  controller: ReadableStreamDefaultController<any>,
  event: "status" | "completed",
  data: string,
) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  controller.enqueue(new TextEncoder().encode(payload));
}
