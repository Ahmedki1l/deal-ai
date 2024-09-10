import Konva from "konva";

type AcceptedFileTypes = string[];

class PhotoEditor {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private photo: Konva.Image | null;
  private theme: Konva.Image | null;
  private transformer: Konva.Transformer;
  private isEditorEnabled: boolean;

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
    this.transformer = new Konva.Transformer();
    this.layer.add(this.transformer);
    this.isEditorEnabled = false;

    this.stage.on("click", (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!this.isEditorEnabled) return;
      if (e.target === this.photo || e.target === this.theme) {
        this.transformer.nodes([e.target]);
      } else {
        this.transformer.nodes([]);
      }
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

  editPhotoPosition(x: number, y: number) {
    if (this.photo) {
      this.photo.position({ x: x, y: y });
      this.layer.draw();
    }
  }

  editPhotoSize(width: number, height: number) {
    if (this.photo) {
      this.photo.size({ width: width, height: height });
      this.layer.draw();
    }
  }

  combinePhotoAndTheme() {
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
    if (this.photo) {
      this.photo.draggable(this.isEditorEnabled);
    }
    if (this.theme) {
      this.theme.draggable(this.isEditorEnabled);
    }
    if (!this.isEditorEnabled) {
      this.transformer.nodes([]);
    }
    this.layer.draw();

    return this.isEditorEnabled;
  }
}

export { PhotoEditor };
