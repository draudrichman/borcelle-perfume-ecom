import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { HeroImages } from "./collections/HeroImages";
import Products from "./collections/Products";
import { Navbar } from "./app/components/Navbar/navbar-config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Function to trigger revalidation
const triggerRevalidation = async () => {
  try {
    const vercelUrl = process.env.SITE_URL; // Fallback to primary URL
    const revalidateUrl = `${vercelUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`;
    // console.log('Triggering revalidation with URL:', revalidateUrl);
    // console.log('VERCEL_URL:', process.env.VERCEL_URL);
    // console.log('REVALIDATE_SECRET:', process.env.REVALIDATE_SECRET ? 'Set' : 'Not set');

    const response = await fetch(revalidateUrl, { method: "POST" });
    const responseText = await response.text();
    console.log("Revalidation response:", response.status, responseText);

    if (!response.ok) {
      throw new Error(
        `Revalidation request failed: ${response.status} ${responseText}`
      );
    }
    console.log("Triggered revalidation successfully");
  } catch (error) {
    console.error("Error triggering revalidation:", error);
  }
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      ...Users,
      hooks: {
        afterChange: [triggerRevalidation],
      },
    },
    {
      ...Media,
      hooks: {
        afterChange: [triggerRevalidation],
      },
    },
    {
      ...HeroImages,
      hooks: {
        afterChange: [triggerRevalidation],
      },
    },
    {
      ...Products,
      hooks: {
        afterChange: [triggerRevalidation],
      },
    },
  ],
  globals: [
    {
      ...Navbar,
      hooks: {
        afterChange: [triggerRevalidation],
      },
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || "",
          secretAccessKey: process.env.S3_SECRET_KEY || "",
        },
        endpoint: process.env.S3_ENDPOINT || "",
        region: process.env.S3_REGION,
        forcePathStyle: true, // Add this line for Supabase
      },
    }),
  ],
});
