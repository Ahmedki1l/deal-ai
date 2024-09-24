import { generateIdFromEntropySize } from "lucia";
import ff01 from "../../public/frames/filled/frame-01.png";
import ff02 from "../../public/frames/filled/frame-02.png";
import ff03 from "../../public/frames/filled/frame-03.png";
import ff04 from "../../public/frames/filled/frame-04.png";
import ff05 from "../../public/frames/filled/frame-05.png";
import f01 from "../../public/frames/frame-01.png";
import f02 from "../../public/frames/frame-02.png";
import f03 from "../../public/frames/frame-03.png";
import f04 from "../../public/frames/frame-04.png";
import f05 from "../../public/frames/frame-05.png";
import { PhotoEditor } from "./konva";

export const ID = {
  generate: (len?: number) => generateIdFromEntropySize(len ?? 10),
};
type ApplyFrameProps = {
  data: { title: string; phone: string; website: string };
  editor: PhotoEditor;
};

export const FRAMES = [
  // {
  //   value: "/frames/frame-00.png",
  //   src: f00?.["src"],
  //   filled: ff00?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {
  //     const titleArr = data?.["title"].split(" ");

  //     // Specify the starting position and spacing
  //     let currentY = 100; // Starting Y position
  //     const startX = 20;
  //     const spacing = 55; // Vertical spacing between each word

  //     if (titleArr?.[0]) {
  //       editor.addText({
  //         text: titleArr?.[0],
  //         fontSize: 32,
  //         x: startX,
  //         y: currentY,
  //       });
  //       currentY += spacing; // Move Y down for the next word
  //     }

  //     if (titleArr?.[1]) {
  //       editor.addText({
  //         text: titleArr?.[1],
  //         fontSize: 50,
  //         fill: "yellow",
  //         x: startX,
  //         y: currentY,
  //       });

  //       currentY += spacing; // Move Y down for the next word
  //     }

  //     if (titleArr?.[2]) {
  //       editor.addText({
  //         text: titleArr?.slice(2).join(" "),
  //         fontSize: 32,
  //         x: startX,
  //         y: currentY,
  //         maxWidth: 250,
  //       });
  //     }

  //     editor.addText({
  //       text: data?.["phone"],
  //       x: startX + 40,
  //       y: 520,
  //     });
  //     editor.addText({
  //       text: data?.["website"],
  //       x: startX + 18,
  //       y: 550,
  //     });
  //   },
  // },
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
        Number(
          ((n / originalWidth) * newWidth + editor?.cropRect!?.x())?.toFixed(2),
        );
      const scaleY = (n: number) =>
        Number(
          ((n / originalHeight) * newHeight + editor?.cropRect!?.y())?.toFixed(
            2,
          ),
        );
      const scaleW = (n: number) =>
        Number(((n / originalWidth) * newWidth)?.toFixed(2));

      editor.addText({
        text: "Architecture Agencies",
        x: scaleX(1133),
        y: scaleY(160),
        width: scaleW(619),
        // height: 195,
        fontSize: scaleW(100),
        fontVariant: "700",
        rotation: 90,
        wrap: "word",
      });
      editor.addText({
        text: "Reservation",
        x: scaleX(847),
        y: scaleY(874),
        // width: 297,
        // height: 41,
        fontSize: scaleW(52),
        fill: "#ffffff",
      });
      editor.addText({
        text: "+123 546 8910",
        x: scaleX(601),
        y: scaleY(968),
        // width: 546,
        // height: 63,
        fontSize: scaleW(80.73),
        fill: "#ffffff",
      });
      editor.addText({
        text: data?.["website"],
        x: scaleX(129),
        y: scaleY(1110),
        // width: 344,
        // height: 24,
        fontSize: scaleW(30),
      });
    },
  },
  {
    value: "/frames/frame-02.png",
    src: f02?.["src"],
    filled: ff02?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      const originalWidth = 1200;
      const originalHeight = 1200;

      const newWidth = editor?.cropRect!?.width();
      const newHeight = editor?.cropRect!?.height();

      const scaleX = (n: number) =>
        Number(
          ((n / originalWidth) * newWidth + editor?.cropRect!?.x())?.toFixed(2),
        );
      const scaleY = (n: number) =>
        Number(
          ((n / originalHeight) * newHeight + editor?.cropRect!?.y())?.toFixed(
            2,
          ),
        );
      const scaleW = (n: number) =>
        Number(((n / originalWidth) * newWidth)?.toFixed(2));

      editor.addText({
        text: "If a building becomes architecture, then it s art.",
        x: scaleX(795),
        y: scaleY(254),
        width: scaleW(338),
        // height: 245,
        fontSize: scaleW(52),
        wrap: "word",
        fill: "#ffffff",
      });
      editor.addText({
        text: data?.["website"],
        x: scaleX(183),
        y: scaleY(1006),
        // width: 343,
        // height: 24,
        fontSize: scaleW(30),
      });
    },
  },
  {
    value: "/frames/frame-03.png",
    src: f03?.["src"],
    filled: ff03?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      const originalWidth = 1200;
      const originalHeight = 1200;

      const newWidth = editor?.cropRect!?.width();
      const newHeight = editor?.cropRect!?.height();

      const scaleX = (n: number) =>
        Number(
          ((n / originalWidth) * newWidth + editor?.cropRect!?.x())?.toFixed(2),
        );
      const scaleY = (n: number) =>
        Number(
          ((n / originalHeight) * newHeight + editor?.cropRect!?.y())?.toFixed(
            2,
          ),
        );
      const scaleW = (n: number) =>
        Number(((n / originalWidth) * newWidth)?.toFixed(2));

      editor.addText({
        text: "Architecture is the thoughtful making of space.",
        x: scaleX(602),
        y: scaleY(657),
        width: scaleW(459),
        // height: 195,
        fontSize: scaleW(52), // 56
        wrap: "word",
      });

      editor.addText({
        text: data?.["website"],
        x: scaleX(788),
        y: scaleY(1097),
        // width: scaleW(344),
        // height: 24,
        fontSize: scaleW(30),
        fill: "#ffffff",
      });
    },
  },
  {
    value: "/frames/frame-04.png",
    src: f04?.["src"],
    filled: ff04?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      const originalWidth = 1200;
      const originalHeight = 1200;

      const newWidth = editor?.cropRect!?.width();
      const newHeight = editor?.cropRect!?.height();

      const scaleX = (n: number) =>
        Number(
          ((n / originalWidth) * newWidth + editor?.cropRect!?.x())?.toFixed(2),
        );
      const scaleY = (n: number) =>
        Number(
          ((n / originalHeight) * newHeight + editor?.cropRect!?.y())?.toFixed(
            2,
          ),
        );
      const scaleW = (n: number) =>
        Number(((n / originalWidth) * newWidth)?.toFixed(2));

      editor.addText({
        text: "Light, God's eldest daughter, is a principal beauty in a building.",
        x: scaleX(753),
        y: scaleY(165),
        width: scaleW(313),
        // height: 396,
        fontSize: scaleW(52), // 56
        wrap: "word",
        fill: "#ffffff",
      });

      editor.addText({
        text: data?.["website"],
        x: scaleX(130),
        y: scaleY(1059),
        // width: scaleW(343),
        // height: 24,
        fontSize: scaleW(30),
      });
    },
  },
  {
    value: "/frames/frame-05.png",
    src: f05?.["src"],
    filled: ff05?.["src"],
    applyFrame: ({ data, editor }: ApplyFrameProps) => {
      const originalWidth = 1200;
      const originalHeight = 1200;

      const newWidth = editor?.cropRect!?.width();
      const newHeight = editor?.cropRect!?.height();

      const scaleX = (n: number) =>
        Number(
          ((n / originalWidth) * newWidth + editor?.cropRect!?.x())?.toFixed(2),
        );
      const scaleY = (n: number) =>
        Number(
          ((n / originalHeight) * newHeight + editor?.cropRect!?.y())?.toFixed(
            2,
          ),
        );
      const scaleW = (n: number) =>
        Number(((n / originalWidth) * newWidth)?.toFixed(2));

      editor.addText({
        text: "Architecture Agencies",
        x: scaleX(350),
        y: scaleY(200),
        width: scaleW(599),
        // height: 188,
        fontSize: scaleW(97),
        fontVariant: "700",
        rotation: 90,
        wrap: "word",
      });
      editor.addText({
        text: "Reservation",
        x: scaleX(750),
        y: scaleY(925),
        // width: 297,
        // height: 41,
        fontSize: scaleW(52),
        fill: "#ffffff",
      });
      editor.addText({
        text: "+123 546 8910",
        x: scaleX(529),
        y: scaleY(1013),
        // width: 546,
        // height: 63,
        fontSize: scaleW(81),
        fontVariant: "700",
        fill: "#ffffff",
      });
      editor.addText({
        text: data?.["website"],
        x: scaleX(1170),
        y: scaleY(80),
        fontSize: scaleW(30),
        rotation: 90,
      });
    },
  },
  // {
  //   value: "/frames/frame-06.png",
  //   src: f06?.["src"],
  //   filled: ff06?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-07.png",
  //   src: f07?.["src"],
  //   filled: ff07?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-08.png",
  //   src: f08?.["src"],
  //   filled: ff08?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-09.png",
  //   src: f09?.["src"],
  //   filled: ff09?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-10.png",
  //   src: f10?.["src"],
  //   filled: ff10?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-11.png",
  //   src: f11?.["src"],
  //   filled: ff11?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-12.png",
  //   src: f12?.["src"],
  //   filled: ff12?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-13.png",
  //   src: f13?.["src"],
  //   filled: ff13?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-14.png",
  //   src: f14?.["src"],
  //   filled: ff14?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-15.png",
  //   src: f15?.["src"],
  //   filled: ff15?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
  // {
  //   value: "/frames/frame-16.png",
  //   src: f16?.["src"],
  //   filled: ff16?.["src"],
  //   applyFrame: ({ data, editor }: ApplyFrameProps) => {},
  // },
];
