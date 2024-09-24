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
import { PhotoEditor } from "./konva";

export const ID = {
  generate: (len?: number) => generateIdFromEntropySize(len ?? 10),
};
type ApplyFrameProps = {
  data: { title: string; phone: string; website: string };
  editor: PhotoEditor;
};

export const FRAMES = [
  {
    value: "/frames/frame-00.png",
    src: f00?.["src"],
    filled: ff00?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      const titleArr = data?.["title"].split(" ");

      // Specify the starting position and spacing
      let currentY = 100; // Starting Y position
      const startX = 20;
      const spacing = 55; // Vertical spacing between each word

      if (titleArr?.[0]) {
        editor.addText({
          text: titleArr?.[0],
          fontSize: 32,
          x: startX,
          y: currentY,
        });
        currentY += spacing; // Move Y down for the next word
      }

      if (titleArr?.[1]) {
        editor.addText({
          text: titleArr?.[1],
          fontSize: 50,
          fill: "yellow",
          x: startX,
          y: currentY,
        });

        currentY += spacing; // Move Y down for the next word
      }

      if (titleArr?.[2]) {
        editor.addText({
          text: titleArr?.slice(2).join(" "),
          fontSize: 32,
          x: startX,
          y: currentY,
          maxWidth: 250,
        });
      }

      editor.addText({
        text: data?.["phone"],
        x: startX + 40,
        y: 520,
      });
      editor.addText({
        text: data?.["website"],
        x: startX + 18,
        y: 550,
      });
    },
  },
  {
    value: "/frames/frame-01.png",
    src: f01?.["src"],
    filled: ff01?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      const originalWidth = 1200;
      const originalHeight = 1200;

      const newWidth = editor?.cropRect!?.width();
      const newHeight = editor?.cropRect!?.height();

      const scaleX = (n: number) =>
        (n / originalWidth) * newWidth + editor?.cropRect!?.x();
      const scaleY = (n: number) =>
        (n / originalHeight) * newHeight + editor?.cropRect!?.y();
      const scaleW = (n: number) => (n / originalWidth) * newWidth;

      editor.addText({
        text: "Architecture Agencies",
        x: scaleX(1133), // Scaled x position
        y: scaleY(160), // Scaled y position
        width: scaleW(619), // Scale width similarly
        // height: 195,
        fontFamily: "Poppins",
        fontSize: scaleW(100),
        fontVariant: "700",
        rotationDeg: 90,
        wrap: "true",
      });
      editor.addText({
        text: "Reservation",
        x: scaleX(847), // Scaled x position
        y: scaleY(874), // Scaled y position
        // width: 297,
        // height: 41,
        fontFamily: "Poppins",
        fontSize: scaleW(51.78),
        fill: "white",
      });
      editor.addText({
        text: "+123 546 8910",
        x: scaleX(601), // Scaled x position
        y: scaleY(968), // Scaled y position
        // width: 546,
        // height: 63,
        fontFamily: "Poppins",
        fontSize: scaleW(80.73),
        fill: "white",
      });
      editor.addText({
        text: data?.["website"],
        x: scaleX(129),
        y: scaleY(1110),
        // width: 344,
        // height: 24,
        fontFamily: "Poppins",
        fontSize: scaleW(30),
      });
    },
  },
  {
    value: "/frames/frame-02.png",
    src: f02?.["src"],
    filled: ff02?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      editor.addText({
        text: editor?.contents?.Long,
        maxWidth: 250,
      });

      editor.addText({
        text: data?.["website"],
        x: editor?.stage.width() - 200,
        y: editor?.stage.height() - 50,
      });
    },
  },
  {
    value: "/frames/frame-03.png",
    src: f03?.["src"],
    filled: ff03?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      editor.addText({
        text: editor.contents?.Long,
        x: editor.stage.width() / 2 + 50,
        y: 150,
        maxWidth: 250,
      });

      editor.addText({
        text: data?.["website"],
        x: 50,
        y: editor.stage.height() - 70,
      });
    },
  },
  {
    value: "/frames/frame-04.png",
    src: f04?.["src"],
    filled: ff04?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-05.png",
    src: f05?.["src"],
    filled: ff05?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-06.png",
    src: f06?.["src"],
    filled: ff06?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-07.png",
    src: f07?.["src"],
    filled: ff07?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-08.png",
    src: f08?.["src"],
    filled: ff08?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-09.png",
    src: f09?.["src"],
    filled: ff09?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-10.png",
    src: f10?.["src"],
    filled: ff10?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-11.png",
    src: f11?.["src"],
    filled: ff11?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-12.png",
    src: f12?.["src"],
    filled: ff12?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-13.png",
    src: f13?.["src"],
    filled: ff13?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-14.png",
    src: f14?.["src"],
    filled: ff14?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-15.png",
    src: f15?.["src"],
    filled: ff15?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
  {
    value: "/frames/frame-16.png",
    src: f16?.["src"],
    filled: ff16?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  },
];
