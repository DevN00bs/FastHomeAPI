import expressJSDocSwagger from "express-jsdoc-swagger";
import express from "express";

const app = express();
const port = process.env.PORT || 5000;

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
  filesPattern: "./**/*.js",
  swaggerUIPath: "/docs",
  servers: [
    {
      url: "https://real-state-api.herokuapp.com",
      description: "The main API's server",
    },
    {
      url: "http://localhost",
      description: "Used for testing",
    },
  ],
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
