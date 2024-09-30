// import {
//   useState,
//   useCallback,
//   ChangeEventHandler,
//   DetailedHTMLProps,
//   InputHTMLAttributes,
//   ChangeEvent,
// } from "react";
// import Cropper from "react-easy-crop";
// import { FiUpload } from "react-icons/fi";
// import { Icons } from "./icons";

// const createImage = (url: string): Promise<HTMLImageElement> =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener("load", () => resolve(image));
//     image.addEventListener("error", (error) => reject(error));
//     image.setAttribute("crossOrigin", "anonymous"); // Avoid CORS issues
//     image.src = url;
//   });

// const getCroppedImg = async (src: string, crop: any): Promise<string> => {
//   const image = await createImage(src);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//   const scaleX = image?.["naturalWidth"] / image?.["width"];
//   const scaleY = image?.["naturalHeight"] / image?.["height"];
//   canvas.width = crop?.["width"];
//   canvas.height = crop?.["height"];

//   ctx.drawImage(
//     image,
//     crop.x * scaleX,
//     crop.y * scaleY,
//     crop.width * scaleX,
//     crop.height * scaleY,
//     0,
//     0,
//     crop?.["width"],
//     crop?.["height"],
//   );

//   return new Promise((resolve) => {
//     canvas.toDataURL("image/jpeg", (dataUrl: string) => {
//       resolve(dataUrl);
//     });
//   });
// };

// export const ImageCropper = () => {
// const [image, setImage] = useState<string | null>(null);
// const [crop, setCrop] = useState({ x: 0, y: 0 });
// const [zoom, setZoom] = useState<number>(1);
// const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
// const [croppedImage, setCroppedImage] = useState<string | null>(null);

// const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
//   setCroppedAreaPixels(croppedAreaPixels);
// }, []);

// const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//   const file = e?.["target"]?.["files"]?.[0];

//   if (file) {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setImage(reader?.["result"] as string);
//     };
//   }
// };

// const showCroppedImage = useCallback(async () => {
//   try {
//     const croppedImage = await getCroppedImg(image!, croppedAreaPixels);
//     console.log(croppedImage);
//     setCroppedImage(croppedImage);
//   } catch (e) {
//     console.error(e);
//   }
// }, [image, croppedAreaPixels]);

//   return (
// <div className="flex flex-col items-center justify-center">
//   {!image ? (
//     <div className="flex aspect-square h-20 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed p-4 transition-all hover:bg-gray-50">
//       <Icons.image className="text-gray-500" />

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="absolute h-full w-full cursor-pointer opacity-0"
//       />
//     </div>
//       ) : (
// <>
//   <div className="relative aspect-square h-40">
//     <Cropper
//       image={image}
//       crop={crop}
//       zoom={zoom}
//       aspect={1}
//       onCropChange={setCrop}
//       onZoomChange={setZoom}
//       onCropComplete={onCropComplete}
//     />
//   </div>
//   <div className="mt-4">
//     <input
//       type="range"
//       min={1}
//       max={3}
//       step={0.1}
//       value={zoom}
//       onChange={(e: ChangeEvent<HTMLInputElement>) =>
//         setZoom(Number(e?.["target"]?.["value"]))
//       }
//       className="w-full"
//     />
//   </div>
//   <button
//     type="button"
//     onClick={showCroppedImage}
//     className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
//   >
//     Crop Image
//   </button>
// </>
//       )}

//       {croppedImage && (
//         <div className="mt-4">
//           <img src={croppedImage} alt="Cropped Logo" className="h-32 w-32" />
//           <p className="mt-2 text-xs text-gray-600">Base64 String:</p>
//           <textarea
//             readOnly
//             className="mt-1 w-full rounded border border-gray-300 p-2 text-xs"
//             value={croppedImage}
//           />
//         </div>
//       )}
//     </div>
//   );
// };
