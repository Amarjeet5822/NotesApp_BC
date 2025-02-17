require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Note Taking Application API",
      version: "1.0.0",
      description: "API documentation for the Note Taking Application",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "apiKey",
          in: "cookie", // Fetch token from cookies
          name: "refreshToken", // Name of the cookie storing JWT
        },
      },
    },
    security: [{ BearerAuth: [] }], // Apply security globally
    servers: [
      {
        url: process.env.BE_URL || "http://localhost:8080",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Users", description: "User authentication and management" },
      { name: "Notes", description: "CRUD operations for Notes" },
      {
        name: "Features",
        description: "Advanced features like search, filter, and sort",
      },
    ],
  },
  apis: ["./routes/*.js"], // Load API documentation from route files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, { 
      customCss: ".swagger-ui { padding-bottom: 50px; }",
      explorer: true,
      swaggerOptions: {
        withCredentials: true, // Enable cookies in Swagger UI requests
      }
    }));
  console.log("📄 Swagger Docs available at http://localhost:8080/api-docs");
};

module.exports = swaggerDocs;
