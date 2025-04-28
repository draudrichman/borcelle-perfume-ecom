import { GlobalConfig } from "payload";

export const Navbar: GlobalConfig = {
  slug: "navbar",
  label: "Navbar",
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "categories",
      type: "array",
      label: "Categories",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "name",
          type: "text",
          label: "Category Name",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          label: "Category Slug",
          required: true,
        },
        {
          name: "dropdownOptions",
          type: "array",
          label: "Dropdown Options",
          fields: [
            {
              name: "name",
              type: "text",
              label: "Option Name",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              label: "Option Slug",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
