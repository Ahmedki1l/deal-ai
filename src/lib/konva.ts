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

  addText(
    text: string = "double click to edit",
    fontSize: number = 50,
    fontFamily: string = "Calibri",
    fill: string = "black",
  ) {
    const textNode = new Konva.Text({
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: fill,
      draggable: true,
      // this.isEditorEnabled,
    });

    // Calculate center positions
    const x = (this.stage.width() - textNode.width()) / 2;
    const y = (this.stage.height() - textNode.height()) / 2;

    textNode.position({ x: x, y: y });

    this.layer.add(textNode);
    this.layer.draw();
    textNode.moveToTop(); // Ensure the text is on top

    // Create the "X" button to delete the text node
    // const closeButton = new Konva.Text({
    //   text: "✖",
    //   fontSize: 14,
    //   fontStyle: "bold",
    //   fill: "red",
    //   x: textNode.x(),
    //   y: textNode.y(),
    //   draggable: false,
    //   listening: true,
    // });

    // closeButton.on("click", () => {
    //   textNode.destroy();
    //   closeButton.destroy();
    //   this.textNodes = this.textNodes.filter((node) => node !== textNode);
    //   this.layer.draw();
    // });

    // this.layer.add(closeButton);

    // Store text nodes and their corresponding close button
    this.textNodes.push(textNode);
    this.history.push(textNode);

    this.layer.draw();

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
        // closeButton.hide();
        this.layer.draw();
        textarea.focus();

        textarea.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            node.text(textarea?.value);
            // closeButton.x(node.x() + node.width() / 2 + 10); // Reposition the close button
            container?.removeChild(textarea);
            node.show();
            // closeButton.show();
            this.layer.draw();
          }
        });

        textarea.addEventListener("blur", () => {
          node.text(textarea.value);
          // closeButton.x(node.x() + node.width() / 2 + 10); // Reposition the close button
          container?.removeChild(textarea);
          node.show();
          // closeButton.show();
          this.layer.draw();
        });
      }
    };

    textNode.on("dblclick", () => {
      createTextArea(textNode);
    });

    this.layer.draw();
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
