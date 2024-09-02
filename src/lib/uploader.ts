import { S3 } from "aws-sdk";

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
