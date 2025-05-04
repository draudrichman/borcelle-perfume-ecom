import type { CollectionConfig } from "payload";
import payload from "payload";
import { anyone } from "./access/anyone";

const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    create: anyone,
    admin: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },

  fields: [
    {
      name: "role",
      type: "select",
      options: [
        { label: "Customer", value: "customer" },
        { label: "Admin", value: "admin" },
      ],
      defaultValue: "customer",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    afterOperation: [
      async ({ operation, result, req }) => {
        if (operation === "create") {
          // Defer customer creation to avoid foreign key timing issue
          setTimeout(async () => {
            try {
              const existingCustomer = await req.payload.find({
                collection: "customers",
                where: { user: { equals: result.id } },
              });

              if (!existingCustomer.docs.length) {
                await req.payload.create({
                  collection: "customers",
                  data: {
                    user: result.id,
                    email: result.email,
                  },
                });
              }
            } catch (err) {
              console.error("Customer creation error:", err);
            }
          }, 0); // Run on next tick
        }
      },
    ],
  },
};

export default Users;
