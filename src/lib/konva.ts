import { ShortContents } from "@/types";
import Konva from "konva";
import { FRAMES } from "./constants";

type AcceptedFileTypes = string[];

// { value: Konva.Image; editable: boolean }
class PhotoEditor {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private transformer: Konva.Transformer;

  private contents: ShortContents | null = null;
  private photo: Konva.Image | null = null;
  private frame: Konva.Image | null = null;
  private textNodes: Konva.Text[] = [];
  private history: Konva.Node[] = [];

  private isEditorEnabled: boolean = true;

  constructor({
    containerId,
    width,
    height,
  }: {
    containerId: string;
    width: number;
    height: number;
  }) {
    this.stage = new Konva.Stage({ container: containerId, width, height });
    this.layer = new Konva.Layer();
    this.transformer = new Konva.Transformer();

    this.layer.add(this.transformer);
    this.stage.add(this.layer);
    this.stage.on("click", (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!this.isEditorEnabled) return;

      const target = e.target as Konva.Image | Konva.Text;

      if (
        e.target === this.photo ||
        e.target === this.frame ||
        this.textNodes.includes(target as Konva.Text)
      )
        this.transformer.nodes([target]);
      else this.transformer.nodes([]);

      this.layer.draw();
    });
  }

  addContents({ contents }: { contents: ShortContents }) {
    this.contents = contents;
  }

  addPhoto({
    url,
  }: {
    url: string;
  }): Promise<{ photoNode: Konva.Image | null }> {
    return new Promise((resolve, reject) => {
      Konva.Image.fromURL(
        url,
        (loadedImageNode: Konva.Image) => {
          const { x, y, width, height } = this.scaledDimentions({
            width: loadedImageNode.width(),
            height: loadedImageNode.height(),
          });

          loadedImageNode.setAttrs({
            x,
            y,
            width,
            height,
            draggable: this.isEditorEnabled,
          });

          if (this.photo) this.photo.destroy();

          this.photo = loadedImageNode;
          this.layer.add(loadedImageNode);
          this.layer.draw();

          resolve({ photoNode: loadedImageNode });
        },
        (err) => {
          reject(err); // Handle error case if image fails to load
        },
      );
    });
  }

  addBase64({
    base64,
  }: {
    base64: string;
    width?: number;
    height?: number;
  }): Promise<{
    photoNode: Konva.Image | null;
  }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64; // set the base64 string as the image source

      image.onload = () => {
        const imageNode = new Konva.Image({
          image: image,
          draggable: this.isEditorEnabled,
        });

        const { x, y, width, height } = this.scaledDimentions({
          width: imageNode?.width() ?? 0,
          height: imageNode?.height() ?? 0,
        });

        imageNode.size({ width, height });
        imageNode.position({ x, y });

        // Remove the previous photo if it exists
        if (this.photo) this.photo.destroy();

        // Add the new image to the layer
        this.photo = imageNode;
        this.layer.add(imageNode);
        this.layer.draw();

        resolve({ photoNode: imageNode });
      };

      // Konva.Image.fromURL(
      //   FRAMES?.[n]?.["src"],
      //   (imageNode: Konva.Image) => {
      //     resolve({ photoNode: imageNode });
      //   },
      //   (err) => {
      //     reject(err); // Handle error case if image fails to load
      //   },
      // );
    });
  }

  addFrame({
    n,
    width = this.stage.width(),
    height = this.stage.height(),
    data,
  }: {
    n: number;
    width?: number;
    height?: number;
    data: { title: string; website: string; phone: string };
  }): Promise<{
    frameNode: Konva.Image | null;
    textNodes: Konva.Text[];
  }> {
    return new Promise((resolve, reject) => {
      Konva.Image.fromURL(
        FRAMES?.[n]?.["src"],
        (imageNode: Konva.Image) => {
          imageNode.setAttrs({
            x: 0,
            y: 0,
            width: this.stage.width(),
            height: this.stage.height(),
            draggable: this.isEditorEnabled,
            opacity: 1,
          });

          [this.frame, ...this.textNodes].forEach((node) => node?.destroy());

          this.frame = imageNode;
          this.textNodes = [];
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
                x: startX,
                y: currentY,
                maxWidth: 250,
              });
            }

            this.addText({
              text: data?.["phone"],
              x: startX + 40,
              y: 520,
            });
            this.addText({
              text: data?.["website"],
              x: startX + 18,
              y: 550,
            });
          }

          if (n === 1) {
            this.addText({
              text: "Architecture Agencies",
              x: 1133,
              y: 160,
              width: 619,
              // height: 195,
              fontFamily: "Poppins",
              fontSize: 100,
              fontVariant: "700",
              rotationDeg: 90,
              wrap: "true",
            });
            this.addText({
              text: "Reservation",
              x: 847,
              y: 874,
              // width: 297,
              // height: 41,
              fontFamily: "Poppins",
              fontSize: 51.78,
              fill: "white",
            });
            this.addText({
              text: "+123 546 8910",
              x: 601,
              y: 968,
              // width: 546,
              // height: 63,
              fontFamily: "Poppins",
              fontSize: 80.73,
              fill: "white",
            });
            this.addText({
              text: data?.["website"],
              x: 129,
              y: 1110,
              // width: 344,
              // height: 24,
              fontFamily: "Poppins",
              fontSize: 30,
            });
          }
          if (n === 2) {
            this.addText({
              text: this.contents?.Long,
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
              text: this.contents?.Long,
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

          resolve({ frameNode: imageNode, textNodes: this.textNodes });
        },
        (err) => {
          reject(err); // Handle error case if image fails to load
        },
      );
    });
  }

  scaledDimentions({ width, height }: { width: number; height: number }) {
    const imageRatio = width / height;
    const editorRatio = this.stage.width() / this.stage.height();

    // Scale the image to fit within the editor's 16:9 bounds while maintaining the image's aspect ratio
    let scaleFactor = 1;
    if (imageRatio > editorRatio) scaleFactor = this.stage.width() / width;
    else scaleFactor = this.stage.height() / height;

    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    // Center the image in the editor
    const centerizedX = (this.stage.width() - scaledWidth) / 2;
    const centerizedY = (this.stage.height() - scaledHeight) / 2;

    return {
      width: scaledWidth,
      height: scaledHeight,
      x: centerizedX,
      y: centerizedY,
    };
  }

  //   addFrame({
  //     base64,
  //     width = this.stage.width(),
  //     height = this.stage.height(),
  //   }: {
  //     base64: string;
  //     width?: number;
  //     height?: number;
  //   }) {
  //     const image = new Image();
  //     image.src = base64; // set the base64 string as the image source

  //     image.onload = () => {
  //       const imageNode = new Konva.Image({
  //         image: image,
  //         draggable: this.isEditorEnabled,
  //       });

  //       const {
  //         x,
  //         y,
  //         width: w,
  //         height: h,
  //       } = this.scaledDimentions({
  //         width,
  //         height,
  //       });

  //       imageNode.size({ width: w, height: h });
  //       imageNode.position({ x, y });

  //       if (this.frame) this.frame.destroy();

  //       this.frame = imageNode;
  //       this.layer.add(imageNode);
  //       this.layer.draw();
  //     };
  //   }

  //   addPhoto({
  //     url,
  //     width, // Desired width of the result image
  //     height, // Desired height of the result image
  //   }: {
  //     url: string;
  //     width?: number;
  //     height?: number;
  //   }) {
  //     Konva.Image.fromURL(url, (imageNode: Konva.Image) => {
  // const editorRatio = this.photoRatio;

  // // Get original image dimensions
  // const originalWidth = imageNode.width();
  // const originalHeight = imageNode.height();
  // const imageRatio = originalWidth / originalHeight;

  // // Scale the image to fit within the editor's 16:9 bounds while maintaining the image's aspect ratio
  // let scaleFactor = 1;
  // if (imageRatio > editorRatio)
  //   scaleFactor = this.stage.width() / originalWidth;
  // else scaleFactor = this.stage.height() / originalHeight;

  // const scaledWidth = originalWidth * scaleFactor;
  // const scaledHeight = originalHeight * scaleFactor;

  // // Center the image in the editor
  // const x = (this.stage.width() - scaledWidth) / 2;
  // const y = (this.stage.height() - scaledHeight) / 2;

  //       imageNode.setAttrs({
  //         x: x,
  //         y: y,
  //         width: scaledWidth,
  //         height: scaledHeight,
  //         draggable: this.isEditorEnabled,
  //       });

  //       if (this.photo) this.photo.destroy();

  //       this.photo = imageNode;
  //       this.layer.add(imageNode);
  //       this.layer.draw();
  //     });
  //   }

  addText({
    text = "double click to edit",
    fontSize = 24,
    fill = "black",
    fontFamily = "Poppins",
    x = this.stage.width() / 2,
    y = this.stage.height() / 2,
    ...props
  }: Konva.TextConfig) {
    const textNode = new Konva.Text({
      text,
      x,
      y,
      fontSize,
      fontFamily,
      fill,
      draggable: true,
      ...props,
    });

    // Add text to layer and render it
    this.layer.add(textNode);
    textNode.moveToTop(); // Ensure the text is on top
    this.layer.draw();

    // Store the text node
    this.textNodes.push(textNode);
    this.layer.draw();

    return { textNode };
  }
  // addFrame(n: number, data: { title: string; phone: string; website: string }) {
  //   Konva.Image.fromURL(frames?.[n]?.["src"], (imageNode: Konva.Image) => {
  //     imageNode.setAttrs({
  //       x: 0,
  //       y: 0,
  //       width: this.stage.width(),
  //       height: this.stage.height(),
  //       draggable: this.isEditorEnabled,
  //       opacity: 1,
  //     });

  //     if (this.frame) {
  //       [this.frame, ...this.textNodes].forEach((node) => {
  //         if (node) node.destroy();
  //       });
  //     }

  //     this.frame = imageNode;
  //     this.layer.add(imageNode);

  //     if (n === 0) {
  //       const titleArr = data?.["title"].split(" ");

  //       // Specify the starting position and spacing
  //       let currentY = 100; // Starting Y position
  //       const startX = 20;
  //       const spacing = 55; // Vertical spacing between each word

  //       if (titleArr?.[0]) {
  //         this.addText({
  //           text: titleArr?.[0],
  //           fontSize: 32,
  //           x: startX,
  //           y: currentY,
  //         });
  //         currentY += spacing; // Move Y down for the next word
  //       }

  //       if (titleArr?.[1]) {
  //         this.addText({
  //           text: titleArr?.[1],
  //           fontSize: 50,
  //           fill: "yellow",
  //           x: startX,
  //           y: currentY,
  //         });

  //         currentY += spacing; // Move Y down for the next word
  //       }

  //       if (titleArr?.[2]) {
  //         this.addText({
  //           text: titleArr?.slice(2).join(" "),
  //           fontSize: 32,
  //           x: startX,
  //           y: currentY,
  //           maxWidth: 250,
  //         });
  //       }

  //       this.addText({ text: data?.["phone"], x: startX + 40, y: 520 });
  //       this.addText({ text: data?.["website"], x: startX + 18, y: 550 });
  //     }

  //     if (n === 1) {
  //       this.addText({
  //         text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse nemo quisquam eveniet sed rem distinctio.",
  //         x: this.stage.width() / 2 + 100,
  //         y: 150,
  //
  //       });

  //       this.addText({
  //         text: data?.["website"],
  //         x: 120,
  //         y: this.stage.height() - 80,
  //       });
  //     }
  //     if (n === 2) {
  //       this.addText({
  //         text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse nemo quisquam eveniet sed rem distinctio.",
  //         maxWidth: 250,
  //       });

  //       this.addText({
  //         text: data?.["website"],
  //         x: this.stage.width() - 200,
  //         y: this.stage.height() - 50,
  //       });
  //     }
  //     if (n === 3) {
  //       this.addText({
  //         text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse nemo quisquam eveniet sed rem distinctio.",
  //         x: this.stage.width() / 2 + 50,
  //         y: 150,
  //         maxWidth: 250,
  //       });

  //       this.addText({
  //         text: data?.["website"],
  //         x: 50,
  //         y: this.stage.height() - 70,
  //       });
  //     }

  //     this.layer.draw();
  //   });
  // }

  // downloadFinalProduct(
  //   pixelRatio: number = 2,
  //   format: "png" | "jpeg" = "png",
  //   quality: number = 1,
  // ) {
  //   this.transformer.nodes([]);
  //   const dataURL = this.stage.toDataURL({
  //     pixelRatio: pixelRatio,
  //     mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
  //     quality: quality,
  //   });

  //   const link = document.createElement("a");
  //   link.href = dataURL;
  //   link.download = `final_image.${format}`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  getResult(
    pixelRatio: number = 2,
    format: "png" | "jpeg" = "png",
    quality: number = 1,
  ) {
    // if (!this.frame && !this.photo) return null;
    this.transformer.nodes([]);

    // Generate the data URL
    const dataURL = this.stage.toDataURL({
      pixelRatio: pixelRatio,
      mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
      quality: quality,
    });
    const base64Data = dataURL.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    return "data:image/png;base64," + buffer.toString("base64");
  }

  getTextNodes() {
    return this.textNodes;
  }

  reset() {
    [this.photo, this.frame, , ...this.textNodes].forEach((node) => {
      if (node) node.destroy();
    });

    this.transformer.nodes([]);
    this.layer.draw();
  }

  //   setEditorSize({ width, height }: { width: number; height: number }) {
  //     const editorRatio = this.ratio; // 16/9
  //     let newWidth = width;
  //     let newHeight = height;

  //     if (width / height > editorRatio) {
  //       newWidth = height * editorRatio; // Constrain width
  //     } else {
  //       newHeight = width / editorRatio; // Constrain height
  //     }

  //     this.stage.size({ width: newWidth, height: newHeight });

  //     if (this.photo) {
  //       // Maintain the aspect ratio of the photo
  //       const imageRatio = this.photo.width() / this.photo.height();
  //       let photoWidth, photoHeight;

  //       if (imageRatio > editorRatio) {
  //         photoWidth = newWidth;
  //         photoHeight = newWidth / imageRatio;
  //       } else {
  //         photoHeight = newHeight;
  //         photoWidth = newHeight * imageRatio;
  //       }

  //       // Center the photo in the editor space
  //       const x = (newWidth - photoWidth) / 2;
  //       const y = (newHeight - photoHeight) / 2;

  // this.photo.size({ width: photoWidth, height: photoHeight });
  // this.photo.position({ x, y });
  //     }

  //     this.layer.draw(); // Ensure the layer is redrawn with new dimensions
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

  //   toggleEditorMode() {
  // this.isEditorEnabled = !this.isEditorEnabled;
  // [
  //   this.photo,
  //   this.frame,
  //   // , ...this.textNodes
  // ].forEach((node) => {
  //   if (node) {
  //     node.draggable(this.isEditorEnabled);
  //   }
  // });

  // if (!this.isEditorEnabled) {
  //   this.transformer.nodes([]);
  // }

  // this.layer.draw();

  // return this.isEditorEnabled;
  //   }
}

export { PhotoEditor };
