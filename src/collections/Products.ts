import { CollectionConfig } from "payload";

const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Product",
    plural: "Products",
  },
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Product Name",
      required: true,
    },
    {
      name: "brand",
      type: "text",
      label: "Brand",
      required: true,
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
    },
    {
      name: "media",
      type: "array",
      label: "Product Images",
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: "image",
          type: "upload",
          label: "Image",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
      required: true,
    },
    {
      name: "price",
      type: "number",
      label: "Price",
      required: true,
      min: 0,
    },
    {
      name: "offer_price",
      type: "number",
      label: "Offer Price",
      min: 0,
    },
    {
      name: "sku",
      type: "text",
      label: "SKU",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (value) {
              return value;
            }
            const name = siblingData.name;
            if (name && typeof name === "string") {
              return name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-")
                .trim();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "is_in_stock",
      type: "checkbox",
      label: "In Stock",
      defaultValue: true,
    },
    {
      name: "top_pick",
      type: "select",
      label: "Top Pick",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      defaultValue: "no",
      hooks: {
        afterRead: [
          ({ value }) => {
            return value === "yes";
          },
        ],
      },
    },
    {
      name: "new_arrival",
      type: "select",
      label: "New Arrival",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      defaultValue: "no",
      hooks: {
        afterRead: [
          ({ value }) => {
            return value === "yes";
          },
        ],
      },
    },
  ],
};

export default Products;
