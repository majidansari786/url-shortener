const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description:
        "A simple and efficient URL shortening service with user authentication, QR code generation, and visitor tracking.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "userAccessToken",
          description: "JWT access token stored in HTTP-only cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            firstname: {
              type: "string",
              description: "User first name",
            },
            lastname: {
              type: "string",
              description: "User last name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
          },
        },
        UserRegistration: {
          type: "object",
          required: ["firstname", "lastname", "email", "password"],
          properties: {
            firstname: {
              type: "string",
              example: "John",
            },
            lastname: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "yourpassword",
            },
          },
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "yourpassword",
            },
          },
        },
        ShortenRequest: {
          type: "object",
          required: ["url", "email"],
          properties: {
            url: {
              type: "string",
              format: "uri",
              example: "https://example.com/very/long/url",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            custom_short: {
              type: "string",
              example: "mylink",
              description: "Optional custom short code",
            },
          },
        },
        QRCodeRequest: {
          type: "object",
          required: ["url"],
          properties: {
            url: {
              type: "string",
              format: "uri",
              example: "https://example.com",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "string",
              description: "Success message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "User authentication and management",
      },
      {
        name: "URLs",
        description: "URL shortening and QR code generation",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
