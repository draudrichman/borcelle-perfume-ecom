import { CollectionConfig } from 'payload';

export const HeroImages: CollectionConfig = {
  slug: 'heroImages',
  labels: {
    singular: 'Hero Image',
    plural: 'Hero Images',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Publicly readable for the frontend
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Hero Image',
      relationTo: 'media', // Assumes a 'media' collection for uploads
      required: true,
    },
  ],
};