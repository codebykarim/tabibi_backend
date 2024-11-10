const fs = require("fs");

const collection = {
  info: {
    name: "Village Management API",
    description: "API collection for village management endpoints.",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Village Services",
      item: [
        {
          name: "Create Village",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Sample Village",
                  location: "Sample Location",
                },
                null,
                2
              ),
            },
            url: { raw: "/create-village", path: ["create-village"] },
          },
        },
        {
          name: "Get All Villages",
          request: {
            method: "GET",
            url: { raw: "/get-all-villages", path: ["get-all-villages"] },
          },
        },
        {
          name: "Get Village",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  id: 1,
                },
                null,
                2
              ),
            },
            url: { raw: "/get-village", path: ["get-village"] },
          },
        },
        {
          name: "Update Village",
          request: {
            method: "PUT",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  id: 1,
                  name: "Updated Village",
                  location: "Updated Location",
                },
                null,
                2
              ),
            },
            url: { raw: "/update-village", path: ["update-village"] },
          },
        },
        {
          name: "Delete Village",
          request: {
            method: "DELETE",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  id: 1,
                },
                null,
                2
              ),
            },
            url: { raw: "/delete-village", path: ["delete-village"] },
          },
        },
      ],
    },
  ],
};

fs.writeFileSync(
  "village-management-collection.json",
  JSON.stringify(collection, null, 2)
);
console.log("Postman collection JSON with folder created successfully!");
