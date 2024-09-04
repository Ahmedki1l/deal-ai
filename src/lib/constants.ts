import { generateIdFromEntropySize } from "lucia";

export const ID = {
  generate: (len?: number) => generateIdFromEntropySize(len ?? 10),
};
export const FRAMES_URL = [
  "./public/frames/frame-00.png",
  "./public/frames/frame-01.png",
  "./public/frames/frame-02.png",
];
