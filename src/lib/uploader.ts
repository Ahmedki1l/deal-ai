import { S3 } from "aws-sdk";
import axios from "axios";

export const s3Client = new S3({
  endpoint: process.env.DO_SPACE_URL,
  region: process.env.DO_SPACE_REGION!,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ID!,
    secretAccessKey: process.env.DO_SPACE_SECRET!,
  },
  httpOptions: { timeout: 60000 }, // 60 seconds
  s3ForcePathStyle: true, // Required for DigitalOcean Spaces
  sslEnabled: true, // SSL enabled
  // httpOptions: {
  //   rejectUnauthorized: false, // Disables SSL validation (not recommended for production)
  // },
});

// Function to fetch an image from a remote URL
export async function fetchImage(url: string) {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  })
    .then((r) => r?.["data"])
    .catch((err) => console.error("error fetching image: ", err?.["message"]));

  return Buffer.from(response, "binary");
}

// export async function fetchImage(url: string) {
//   try {
//     console.log("url: ", url);
//     const response = await axios({
//       url,
//       responseType: "stream", // Stream the image
//       timeout: 10000, // 10-second timeout
//     });

//     const chunks: Buffer[] = [];
//     return await new Promise<Buffer>((resolve, reject) => {
//       response.data.on("data", (chunk: Buffer) => chunks.push(chunk));
//       response.data.on("end", () => resolve(Buffer.concat(chunks)));
//       response.data.on("error", (err: Error) => reject(err));
//     });
//   } catch (error: any) {
//     console.error("Error fetching image: ", error?.["message"]);
//     throw error;
//   }
// }
