import { CollectionConfig } from "payload";

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "id",
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      hasMany: false,
    },
    {
      name: "products",
      type: "array",
      required: true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: "total_amount",
      type: "number",
      required: true,
      min: 0,
    },
  ],
  timestamps: true,
};

export default Orders;
