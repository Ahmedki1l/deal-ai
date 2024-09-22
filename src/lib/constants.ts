import { generateIdFromEntropySize } from "lucia";
import ff00 from "../../public/frames/filled/frame-00.png";
import ff01 from "../../public/frames/filled/frame-01.png";
import ff02 from "../../public/frames/filled/frame-02.png";
import ff03 from "../../public/frames/filled/frame-03.png";
import ff04 from "../../public/frames/filled/frame-04.png";
import ff05 from "../../public/frames/filled/frame-05.png";
import ff06 from "../../public/frames/filled/frame-06.png";
import ff07 from "../../public/frames/filled/frame-07.png";
import ff08 from "../../public/frames/filled/frame-08.png";
import ff09 from "../../public/frames/filled/frame-09.png";
import ff10 from "../../public/frames/filled/frame-10.png";
import ff11 from "../../public/frames/filled/frame-11.png";
import ff12 from "../../public/frames/filled/frame-12.png";
import ff13 from "../../public/frames/filled/frame-13.png";
import ff14 from "../../public/frames/filled/frame-14.png";
import ff15 from "../../public/frames/filled/frame-15.png";
import ff16 from "../../public/frames/filled/frame-16.png";
import f00 from "../../public/frames/frame-00.png";
import f01 from "../../public/frames/frame-01.png";
import f02 from "../../public/frames/frame-02.png";
import f03 from "../../public/frames/frame-03.png";
import f04 from "../../public/frames/frame-04.png";
import f05 from "../../public/frames/frame-05.png";
import f06 from "../../public/frames/frame-06.png";
import f07 from "../../public/frames/frame-07.png";
import f08 from "../../public/frames/frame-08.png";
import f09 from "../../public/frames/frame-09.png";
import f10 from "../../public/frames/frame-10.png";
import f11 from "../../public/frames/frame-11.png";
import f12 from "../../public/frames/frame-12.png";
import f13 from "../../public/frames/frame-13.png";
import f14 from "../../public/frames/frame-14.png";
import f15 from "../../public/frames/frame-15.png";
import f16 from "../../public/frames/frame-16.png";

export const ID = {
  generate: (len?: number) => generateIdFromEntropySize(len ?? 10),
};
type ApplyFrameProps = { data: { title: string }; img: string };

export const FRAMES = [
  {
    value: "/frames/frame-00.png",
    src: f00?.["src"],
    filled: ff00?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-01.png",
    src: f01?.["src"],
    filled: ff01?.["src"],
    applyFrame: ({ data, img }: { data: { title: string }; img: string }) => {},
  },
  {
    value: "/frames/frame-02.png",
    src: f02?.["src"],
    filled: ff02?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-03.png",
    src: f03?.["src"],
    filled: ff03?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-04.png",
    src: f04?.["src"],
    filled: ff04?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-05.png",
    src: f05?.["src"],
    filled: ff05?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-06.png",
    src: f06?.["src"],
    filled: ff06?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-07.png",
    src: f07?.["src"],
    filled: ff07?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-08.png",
    src: f08?.["src"],
    filled: ff08?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-09.png",
    src: f09?.["src"],
    filled: ff09?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-10.png",
    src: f10?.["src"],
    filled: ff10?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-11.png",
    src: f11?.["src"],
    filled: ff11?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-12.png",
    src: f12?.["src"],
    filled: ff12?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-13.png",
    src: f13?.["src"],
    filled: ff13?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-14.png",
    src: f14?.["src"],
    filled: ff14?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-15.png",
    src: f15?.["src"],
    filled: ff15?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-16.png",
    src: f16?.["src"],
    filled: ff16?.["src"],
    applyFrame: ({ data, img }: ApplyFrameProps) => {},
  },
];
