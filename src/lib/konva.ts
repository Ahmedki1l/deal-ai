// import Konva from "konva";
// type AcceptedFileTypes = string[];

// class PhotoEditor {

//   addPhoto(
//     photoUrl: string,
//     x: number = 0,
//     y: number = 0,
//     width: number = this.stage.width(),
//     height: number = this.stage.height(),
//   ) {
//     Konva.Image.fromURL(photoUrl, (imageNode: Konva.Image) => {
//       imageNode.setAttrs({
//         x: x,
//         y: y,
//         width: width,
//         height: height,
//         draggable: this.isEditorEnabled,
//       });

//       if (this.photo) {
//         this.photo.destroy();
//       }
//       this.photo = imageNode;
//       this.layer.add(imageNode);
//       this.history.push(imageNode);
//       this.layer.draw();
//     });
//   }

//   addTheme(
//     themeUrl: string,
//     x: number = 0,
//     y: number = 0,
//     opacity: number = 1,
//     width: number = this.stage.width(),
//     height: number = this.stage.height(),
//   ) {
//     Konva.Image.fromURL(themeUrl, (imageNode: Konva.Image) => {
//       imageNode.setAttrs({
//         x: x,
//         y: y,
//         width: width,
//         height: height,
//         draggable: this.isEditorEnabled,
//         opacity: opacity,
//       });

//       if (this.theme) {
//         this.theme.destroy();
//       }
//       this.theme = imageNode;
//       this.layer.add(imageNode);
//       this.history.push(imageNode);
//       this.layer.draw();
//     });
//   }

//   combinePhotoAndTheme() {
//     this.layer.draw();
//   }
//   undo() {
//     if (this.history.length > 0) {
//       const nodeToRemove = this.history.pop();
//       nodeToRemove?.destroy();
//       this.layer.draw();
//     }
//   }
//   downloadFinalProduct(
//     pixelRatio: number = 2,
//     format: "png" | "jpeg" = "png",
//     quality: number = 1,
//   ) {
//     this.transformer.nodes([]);
//     const dataURL = this.stage.toDataURL({
//       pixelRatio: pixelRatio,
//       mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
//       quality: quality,
//     });

//     const link = document.createElement("a");
//     link.href = dataURL;
//     link.download = `final_image.${format}`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
//   getResult(
//     pixelRatio: number = 2,
//     format: "png" | "jpeg" = "png",
//     quality: number = 1,
//   ) {
//     this.transformer.nodes([]);

//     // Generate the data URL
//     const dataURL = this.stage.toDataURL({
//       pixelRatio: pixelRatio,
//       mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
//       quality: quality,
//     });

//     // Strip the metadata part of the base64 string (data:image/png;base64,...)
//     const base64Data = dataURL.split(",")[1];

//     // Convert the base64 string into a buffer and return it as a base64 string
//     const buffer = Buffer.from(base64Data, "base64");

//     // Return the buffer as a base64 encoded string
//     return buffer.toString("base64");
//   }

//   attachViewerToBody() {
//     const viewerContainer = document.createElement("div");
//     viewerContainer.id = "photo-editor-viewer";
//     viewerContainer.style.border = "1px solid #ccc";
//     viewerContainer.style.width = `${this.stage.width()}px`;
//     viewerContainer.style.height = `${this.stage.height()}px`;
//     document.body.appendChild(viewerContainer);

//     const viewerStage = new Konva.Stage({
//       container: "photo-editor-viewer",
//       width: this.stage.width(),
//       height: this.stage.height(),
//     });

//     const viewerLayer = new Konva.Layer();
//     viewerStage.add(viewerLayer);

//     const clonedLayer = this.layer.clone();
//     viewerLayer.add(clonedLayer);
//     viewerLayer.draw();
//   }

//   uploadPhoto(
//     acceptedFileTypes: AcceptedFileTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/gif",
//     ],
//   ) {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = acceptedFileTypes.join(",");
//     input.onchange = (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files ? target.files[0] : null;
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e: ProgressEvent<FileReader>) => {
//           const result = e.target?.result as string;
//           this.addPhoto(result);
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   }

//   uploadTheme(
//     acceptedFileTypes: AcceptedFileTypes = ["image/jpeg", "image/png"],
//   ) {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = acceptedFileTypes.join(",");
//     input.onchange = (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files ? target.files[0] : null;
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e: ProgressEvent<FileReader>) => {
//           const result = e.target?.result as string;
//           this.addTheme(result);
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   }

// export { PhotoEditor };

import { frames } from "@/components/post-update-form";
import Konva from "konva";

type AcceptedFileTypes = string[];

class PhotoEditor {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private photo: Konva.Image | null;
  private theme: Konva.Image | null;
  private transformer: Konva.Transformer;
  private isEditorEnabled: boolean;

  private textNodes: Konva.Text[];
  private history: Konva.Node[];

  constructor(containerId: string, width: number, height: number) {
    this.stage = new Konva.Stage({
      container: containerId,
      width: width,
      height: height,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.photo = null;
    this.theme = null;
    this.textNodes = [];
    this.history = [];

    this.transformer = new Konva.Transformer();
    this.layer.add(this.transformer);
    this.isEditorEnabled = false;

    this.stage.on("click", (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!this.isEditorEnabled) return;
      const target = e.target as Konva.Image | Konva.Text;
      if (
        e.target === this.photo ||
        e.target === this.theme ||
        this.textNodes.includes(target as Konva.Text)
      )
        this.transformer.nodes([target]);
      else this.transformer.nodes([]);

      this.layer.draw();
    });
  }

  addPhoto(
    photoUrl: string,
    x: number = 0,
    y: number = 0,
    width: number = this.stage.width(),
    height: number = this.stage.height(),
  ) {
    Konva.Image.fromURL(photoUrl, (imageNode: Konva.Image) => {
      imageNode.setAttrs({
        x: x,
        y: y,
        width: width,
        height: height,
        draggable: this.isEditorEnabled,
      });

      if (this.photo) {
        this.photo.destroy();
      }
      this.photo = imageNode;
      this.layer.add(imageNode);
      this.layer.draw();
    });
  }

  addTheme(
    themeUrl: string,
    x: number = 0,
    y: number = 0,
    opacity: number = 1,
    width: number = this.stage.width(),
    height: number = this.stage.height(),
  ) {
    Konva.Image.fromURL(themeUrl, (imageNode: Konva.Image) => {
      imageNode.setAttrs({
        x: x,
        y: y,
        width: width,
        height: height,
        draggable: this.isEditorEnabled,
        opacity: opacity || 1,
      });

      if (this.theme) {
        this.theme.destroy();
      }
      this.theme = imageNode;
      this.layer.add(imageNode);
      this.layer.draw();
    });
  }

  addText({
    text = "double click to edit",
    fontSize = 24,
    fontFamily = "Cairo",
    fill = "black",
    x = this.stage.width() / 2, // Default position centered
    y = this.stage.height() / 2, // Default position centered
    maxWidth = this.stage.width() - 20, // Leave some padding for width
  }: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    x?: number;
    y?: number;
    maxWidth?: number;
  }) {
    const wrappedText = this.wrapText(text, fontSize, fontFamily, maxWidth);

    const textNode = new Konva.Text({
      text: wrappedText,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: fill,
      draggable: true,
      width: maxWidth, // Set the maximum width for the text
    });

    // Set the position
    textNode.position({ x: x, y: y });

    // Add text to layer and render it
    this.layer.add(textNode);
    textNode.moveToTop(); // Ensure the text is on top
    this.layer.draw();

    // Store the text node
    this.textNodes.push(textNode);
    this.history.push(textNode);

    const createTextArea = (node: Konva.Text) => {
      const textPosition = node.getClientRect();
      const stage = node.getStage();
      const container = stage?.container();

      if (container) {
        const textarea = document.createElement("textarea");
        container.appendChild(textarea);

        textarea.value = node.text();
        textarea.style.position = "absolute";
        textarea.style.top = textPosition.y + "px";
        textarea.style.left = textPosition.x + "px";
        textarea.style.width = textPosition.width + "px";
        textarea.style.height = textPosition.height + "px";
        textarea.style.fontSize = fontSize + "px";
        textarea.style.fontFamily = fontFamily;
        textarea.style.color = fill;
        textarea.style.background = "transparent";
        textarea.style.border = "1px solid gray";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.overflow = "hidden";
        textarea.style.zIndex = "100";

        node.hide();
        this.layer.draw();
        textarea.focus();

        textarea.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            node.text(textarea?.value);
            container?.removeChild(textarea);
            node.show();
            this.layer.draw();
          }
        });

        textarea.addEventListener("blur", () => {
          node.text(textarea.value);
          container?.removeChild(textarea);
          node.show();
          this.layer.draw();
        });
      }
    };

    textNode.on("dblclick", () => {
      createTextArea(textNode);
    });

    this.layer.draw();
  }

  // Helper function to wrap text based on stage width
  wrapText(
    text: string,
    fontSize: number,
    fontFamily: string,
    maxWidth: number,
  ) {
    const dummyTextNode = new Konva.Text({
      text: "",
      fontSize: fontSize,
      fontFamily: fontFamily,
    });

    const words = text.split(" ");
    let line = "";
    let wrappedText = "";

    words.forEach((word, index) => {
      let testLine = line + word + " ";
      dummyTextNode.text(testLine);

      if (dummyTextNode.width() > maxWidth && index > 0) {
        wrappedText += line + "\n"; // Wrap the line
        line = word + " "; // Start a new line with the current word
      } else {
        line = testLine;
      }
    });

    wrappedText += line; // Add the last line

    return wrappedText;
  }
  addFrame(n: number, data: { title: string; phone: string; website: string }) {
    Konva.Image.fromURL(frames?.[n]?.["src"], (imageNode: Konva.Image) => {
      imageNode.setAttrs({
        x: 0,
        y: 0,
        width: this.stage.width(),
        height: this.stage.height(),
        draggable: this.isEditorEnabled,
        opacity: 1,
      });

      if (this.theme) {
        [this.theme, ...this.textNodes].forEach((node) => {
          if (node) node.destroy();
        });
      }

      this.theme = imageNode;
      this.layer.add(imageNode);

      if (n === 0) {
        const titleArr = data?.["title"].split(" ");

        // Specify the starting position and spacing
        let currentY = 100; // Starting Y position
        const startX = 20;
        const spacing = 55; // Vertical spacing between each word

        if (titleArr?.[0]) {
          this.addText({
            text: titleArr?.[0],
            fontSize: 32,
            fontFamily: "Calibri",
            x: startX,
            y: currentY,
          });
          currentY += spacing; // Move Y down for the next word
        }

        if (titleArr?.[1]) {
          this.addText({
            text: titleArr?.[1],
            fontSize: 50,
            fill: "yellow",
            x: startX,
            y: currentY,
          });

          currentY += spacing; // Move Y down for the next word
        }

        if (titleArr?.[2]) {
          this.addText({
            text: titleArr?.slice(2).join(" "),
            fontSize: 32,
            fontFamily: "Calibri",
            x: startX,
            y: currentY,
            maxWidth: 250,
          });
        }

        this.addText({ text: data?.["phone"], x: startX + 40, y: 520 });
        this.addText({ text: data?.["website"], x: startX + 18, y: 550 });
      }

      if (n === 1) {
        this.addText({
          text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse nemo quisquam eveniet sed rem distinctio.",
          x: this.stage.width() / 2 + 100,
          y: 150,
          maxWidth: this.stage.width() - (this.stage.width() / 2 + 100),
        });

        this.addText({
          text: data?.["website"],
          x: 120,
          y: this.stage.height() - 80,
        });
      }
      if (n === 2) {
        this.addText({
          text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse nemo quisquam eveniet sed rem distinctio.",
          maxWidth: 250,
        });

        this.addText({
          text: data?.["website"],
          x: this.stage.width() - 200,
          y: this.stage.height() - 50,
        });
      }
      if (n === 3) {
        this.addText({
          text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse nemo quisquam eveniet sed rem distinctio.",
          x: this.stage.width() / 2 + 50,
          y: 150,
          maxWidth: 250,
        });

        this.addText({
          text: data?.["website"],
          x: 50,
          y: this.stage.height() - 70,
        });
      }

      this.layer.draw();
    });
  }

  downloadFinalProduct(
    pixelRatio: number = 2,
    format: "png" | "jpeg" = "png",
    quality: number = 1,
  ) {
    this.transformer.nodes([]);
    const dataURL = this.stage.toDataURL({
      pixelRatio: pixelRatio,
      mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
      quality: quality,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `final_image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getResult(
    pixelRatio: number = 2,
    format: "png" | "jpeg" = "png",
    quality: number = 1,
  ) {
    this.transformer.nodes([]);

    // Generate the data URL
    const dataURL = this.stage.toDataURL({
      pixelRatio: pixelRatio,
      mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
      quality: quality,
    });

    // Strip the metadata part of the base64 string (data:image/png;base64,...)
    const base64Data = dataURL.split(",")[1];

    // Convert the base64 string into a buffer and return it as a base64 string
    const buffer = Buffer.from(base64Data, "base64");

    // Return the buffer as a base64 encoded string
    return buffer.toString("base64");
  }

  attachViewerToBody() {
    const viewerContainer = document.createElement("div");
    viewerContainer.id = "photo-editor-viewer";
    viewerContainer.style.border = "1px solid #ccc";
    viewerContainer.style.width = `${this.stage.width()}px`;
    viewerContainer.style.height = `${this.stage.height()}px`;
    document.body.appendChild(viewerContainer);

    const viewerStage = new Konva.Stage({
      container: "photo-editor-viewer",
      width: this.stage.width(),
      height: this.stage.height(),
    });

    const viewerLayer = new Konva.Layer();
    viewerStage.add(viewerLayer);

    const clonedLayer = this.layer.clone();
    viewerLayer.add(clonedLayer);
    viewerLayer.draw();
  }

  uploadPhoto(
    acceptedFileTypes: AcceptedFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
    ],
  ) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileTypes.join(",");
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.addPhoto(result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  uploadTheme(
    acceptedFileTypes: AcceptedFileTypes = ["image/jpeg", "image/png"],
  ) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileTypes.join(",");
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.addTheme(result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  toggleEditorMode() {
    this.isEditorEnabled = !this.isEditorEnabled;
    [
      this.photo,
      this.theme,
      // , ...this.textNodes
    ].forEach((node) => {
      if (node) {
        node.draggable(this.isEditorEnabled);
      }
    });

    if (!this.isEditorEnabled) {
      this.transformer.nodes([]);
    }

    this.layer.draw();

    return this.isEditorEnabled;
  }
}

export { PhotoEditor };
