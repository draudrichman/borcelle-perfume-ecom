import { CollectionConfig } from "payload";

const Customers: CollectionConfig = {
  slug: "customers",
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: false,
      hasMany: false,
    },
    {
      name: "email",
      type: "email",
      required: false,
      unique: true,
    },
    {
      name: "gender",
      type: "select",
      options: ["Male", "Female", "Non-binary", "Prefer not to say"],
      required: false,
      defaultValue: "Prefer not to say",
    },
    {
      name: "date_of_birth",
      type: "date",
      required: false,
    },
    {
      name: "orders",
      type: "relationship",
      relationTo: "orders",
      required: false,
      hasMany: true,
    },
    {
      name: "favorites",
      type: "relationship",
      relationTo: "products",
      required: false,
      hasMany: true,
    //   description: "Products favorited by the customer",
    },
  ],
  timestamps: true,
};

export default Customers;
