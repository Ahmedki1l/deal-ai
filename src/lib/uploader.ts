import { S3 } from "aws-sdk";
import axios from "axios";

export const s3Client = new S3({
  endpoint: process.env.DO_SPACE_URL,
  region: process.env.DO_SPACE_REGION!,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ID!,
    secretAccessKey: process.env.DO_SPACE_SECRET!,
  },
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
  });
  return Buffer.from(response.data, "binary");
}
