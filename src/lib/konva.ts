import { ShortContents } from "@/types";
import { LocaleProps } from "@/types/locale";
import Konva from "konva";
import { ApplyFrameProps, FRAMES } from "./constants";

// { value: Konva.Image; editable: boolean }
class PhotoEditor {
  public stage: Konva.Stage;
  public layer: Konva.Layer;
  public transformer: Konva.Transformer;
  public cropRect: Konva.Rect | null = null;

  public contents: ShortContents | null = null;
  public photo: Konva.Image | null = null;
  public frame: Konva.Image | null = null;
  public textNodes: Konva.Text[] = [];

  constructor({
    contents,
    containerId,
    ...props
  }: {
    containerId: string;
    width: number;
    height: number;
    contents: ShortContents;
  }) {
    this.stage = new Konva.Stage({ container: containerId, ...props });
    this.layer = new Konva.Layer();
    this.transformer = new Konva.Transformer();
    this.contents = contents;

    this.layer.add(this.transformer);
    this.stage.add(this.layer);

    // Initialize the cropping rectangle
    this.initCropRect();
    this.reorderLayers();

    // this.stage.on("click", (e: Konva.KonvaEventObject<MouseEvent>) => {
    //   const target = e.target as Konva.Image | Konva.Text | Konva.Rect;

    //   if (
    //     target === this.cropRect ||
    //     target === this.photo ||
    //     target === this.frame ||
    //     this.textNodes.includes(target as Konva.Text)
    //   )
    //     this.dragNode(target);
    //   else this.transformer.nodes([]);
    // });
  }
  private initCropRect() {
    const editorRatio = 1 / 1; // ratio: 1:1, 3:4, 9:16, full
    const cropHeight = this.stage.height() * 0.9;
    const cropWidth = cropHeight / editorRatio;

    // Create the crop rectangle
    this.cropRect = new Konva.Rect({
      x: (this.stage.width() - cropWidth) / 2,
      y: (this.stage.height() - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
      stroke: "black", // Border color
      strokeWidth: 2,
      dash: [4, 4], // Dashed line pattern [dash length, gap length]
      draggable: false,
    });

    // Limit movement to stay within stage bounds
    this.cropRect.on("dragmove", () => {
      const rect = this.cropRect!;
      const stageWidth = this.stage.width();
      const stageHeight = this.stage.height();

      // Keep the crop rect within the bounds of the stage
      if (rect.x() < 0) rect.x(0);
      if (rect.y() < 0) rect.y(0);

      if (rect.x() + rect.width() > stageWidth)
        rect.x(stageWidth - rect.width());

      if (rect.y() + rect.height() > stageHeight)
        rect.y(stageHeight - rect.height());
    });

    this.layer.add(this.cropRect);
    this.reorderLayers();
    this.layer.draw();
  }

  public adjustCropRect({ ratio }: { ratio: number }) {
    const newHeight = this.stage.height() * 0.9;
    const newWidth = newHeight / ratio;

    this.cropRect?.size({ width: newWidth, height: newHeight });
    this.cropRect?.position({
      x: (this.stage.width() - newWidth) / 2,
      y: (this.stage.height() - newHeight) / 2,
    });
    this.reorderLayers();
    this.layer.draw();
  }

  setEditorSize({ width, height }: { width: number; height: number }) {
    this.stage.size({ width, height });
    this.adjustCropRect({
      ratio: this.cropRect!.width() / this.cropRect!.height(),
    });
    this.reorderLayers();
    this.layer.draw(); // Ensure the layer is redrawn
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
            draggable: false,
          });

          if (this.photo) this.photo.destroy();

          this.photo = loadedImageNode;
          this.layer.add(loadedImageNode);

          this.reorderLayers();
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
          draggable: false,
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
        this.reorderLayers();
        this.layer.draw();

        resolve({ photoNode: imageNode });
      };
    });
  }

  addFrame({
    n,
    width = this.stage.width(),
    height = this.stage.height(),
    ...applyFrameProps
  }: {
    n: number;
    width?: number;
    height?: number;
  } & ApplyFrameProps): Promise<{
    frameNode: Konva.Image | null;
    textNodes: Konva.Text[];
  }> {
    return new Promise((resolve, reject) => {
      Konva.Image.fromURL(
        FRAMES?.[n]?.["src"],
        (imageNode: Konva.Image) => {
          imageNode.setAttrs({
            x: this.cropRect?.x(),
            y: this.cropRect?.y(),
            width: this.cropRect?.width(),
            height: this.cropRect?.height(),
            draggable: false,
            opacity: 1,
          });

          [this.frame, ...this.textNodes].map((node) => node?.destroy());

          this.frame = imageNode;
          this.textNodes = [];
          this.layer.add(imageNode);
          FRAMES?.[n]?.applyFrame({ ...applyFrameProps });

          this.reorderLayers(); // Keep the order consistent
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
    const editorRatio = this.stage!?.width() / this.stage!?.height();

    const scaleFactor =
      imageRatio > editorRatio
        ? this.stage!?.width() / width
        : this.stage!?.height() / height;

    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    const centerizedX = (this.stage!?.width() - scaledWidth) / 2;
    const centerizedY = (this.stage!?.height() - scaledHeight) / 2;

    return {
      width: scaledWidth,
      height: scaledHeight,
      x: centerizedX,
      y: centerizedY,
    };
  }
  reorderLayers() {
    if (this.photo) this.photo.setZIndex(0);
    if (this.cropRect) this.cropRect.setZIndex(1);
    if (this.frame) this.frame.setZIndex(2);
    this.textNodes.forEach((txtNode, i) => txtNode.setZIndex(3 + i));

    // Redraw the layer to reflect changes
    this.layer.draw();
  }

  addText({
    lang,
    fontStyle,
    strokeWidth,
    align,
    fontFamily,

    text = "double click to edit",
    fontSize = 24,
    fill = "#000000",
    x = this.stage.width() / 2,
    y = this.stage.height() / 2,
    ...props
  }: Konva.TextConfig & LocaleProps) {
    const langCheck = (ar: any, en: any) => (lang === "ar" ? ar : en);

    const textNode = new Konva.Text({
      text,
      x,
      y,
      fontSize,
      fill,
      fontFamily: fontFamily ?? langCheck("Cairo", "Poppins"),
      align: align ?? langCheck("right", "left"),
      fontStyle: fontStyle ?? langCheck("bold", "normal"),
      strokeWidth: strokeWidth ?? langCheck(1, 0.5),

      draggable: false,
      ...props,
    });

    this.layer.add(textNode);
    this.reorderLayers();
    this.layer.draw();

    this.reorderLayers();
    this.textNodes.push(textNode);
    this.layer.draw();

    return { textNode };
  }

  getResult(
    pixelRatio: number = 2,
    format: "png" | "jpeg" = "png",
    quality: number = 1,
  ) {
    // if (!this.frame && !this.photo) return null;
    this.transformer.nodes([]);

    const cropArea = this.cropRect!.getClientRect(); // Get the cropping rectangle coordinates

    // Generate the data URL
    const dataURL = this.stage.toDataURL({
      x: cropArea.x,
      y: cropArea.y,
      width: cropArea.width,
      height: cropArea.height,
      pixelRatio: pixelRatio,
      mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
      quality: quality,
    });
    const base64Data = dataURL.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    return "data:image/png;base64," + buffer.toString("base64");
  }

  reset() {
    [this.photo, this.frame, , ...this.textNodes].forEach((node) => {
      if (node) node.destroy();
    });

    this.transformer.nodes([]);
    this.layer.draw();
  }

  dragNode(
    node: any,
    // Konva.Rect | Konva.Image | Konva.Text
  ) {
    // Disable dragging for all nodes
    [this.cropRect, this.photo, this.frame, ...this.textNodes].forEach((n) => {
      if (n === node) {
        node?.draggable(true);
        node?.listening(true);
      } else {
        n?.draggable(false);
        n?.listening(false);
      }
    });

    this.transformer.nodes([node]);

    // Redraw the layer
    this.layer.draw();
  }

  recenterNode(node: Konva.Node) {
    const { width, height } = node.size();
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
  
    const x = (stageWidth - width) / 2;
    const y = (stageHeight - height) / 2;
  
    node.position({ x, y });
    this.layer.draw(); // Ensure the layer is updated after recentering
  }
  
  recenterAllNodes() {
    if (this.photo) this.recenterNode(this.photo);
    if (this.frame) this.recenterNode(this.frame);
    if (this.cropRect) this.recenterNode(this.cropRect);
    this.textNodes.forEach((textNode) => this.recenterNode(textNode));
  
    this.layer.draw(); // Redraw the layer after all nodes are centered
  }
  
  
}

export { PhotoEditor };
