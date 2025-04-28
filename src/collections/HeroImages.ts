import { CollectionConfig } from "payload";

export const HeroImages: CollectionConfig = {
  slug: "heroImages",
  labels: {
    singular: "Hero Image",
    plural: "Hero Images",
  },
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true, // Publicly readable for the frontend
  },
  upload: {
    staticDir: "media", // Not used with Supabase S3, but required for upload config
    mimeTypes: ["image/*"], // Restrict to images
    // Configure Supabase S3 storage (already set up in payload.config.ts)
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
    },
  ],
};
