import expressJSDocSwagger from "express-jsdoc-swagger";
import propertiesRoutes from "./routes/properties";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "1mb" }));

expressJSDocSwagger(app)({
  info: {
    title: "FastHome API",
    version: "0.1.0",
    description:
      "REST API to serve data to the different app versions. Uses Express and MariaDB as database.",
    license: {
      name: "MIT",
    },
  },
  baseDir: __dirname,
  filesPattern: ["./entities/*.js", "./routes/*.js"],
  swaggerUIPath: "/docs",
  servers: [
    {
      url: process.env.HOST!,
      description: "The main API's server",
    },
    {
      url: "http://localhost:" + port,
      description: "Used for testing",
    },
  ],
});

app.use(cors());

// Routers declarations
app.use("/api", propertiesRoutes);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
