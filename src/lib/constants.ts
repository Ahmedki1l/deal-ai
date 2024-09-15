import { generateIdFromEntropySize } from "lucia";

export const ID = {
  generate: (len?: number) => generateIdFromEntropySize(len ?? 10),
};
export const FRAMES_URL = [
  "./public/frames/frame-00.png",
  // "./public/frames/frame-01.png",
  "./public/frames/frame-02.png",
  "./public/frames/frame-03.png",
  "./public/frames/frame-04.png",
  "./public/frames/frame-05.png",
  "./public/frames/frame-06.png",
  "./public/frames/frame-07.png",
  "./public/frames/frame-08.png",
  "./public/frames/frame-09.png",
  "./public/frames/frame-10.png",
  "./public/frames/frame-11.png",
  "./public/frames/frame-12.png",
  "./public/frames/frame-13.png",
  "./public/frames/frame-14.png",
  "./public/frames/frame-15.png",
  "./public/frames/frame-16.png",
];
