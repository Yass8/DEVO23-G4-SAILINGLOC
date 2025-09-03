import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
        title: "SailingLoc API",
        version: "1.0.0",
        description: "API documentation for SailingLoc application",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
    },
    apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;