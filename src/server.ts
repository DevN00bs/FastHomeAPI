import expressJSDocSwagger from "express-jsdoc-swagger";
import propertiesRoutes from "./routes/properties"
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '1mb' }));

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

app.use(cors());

// Routers declarations
app.use(propertiesRoutes)

//login.

app.post('/v1/login', (req, res) => {
  console.log("log in");
  res.send('log in')
});

app.post('/v1/register', (req, res) => {
  console.log("register");
  res.send('register')
});

//Profiles.
app.get("/v1/profiles", (req, res) => {
  console.log("all vendors");
  res.send('vendors')
});

app.post("/v1/profiles/:userId", (req, res) => {
  console.log("SHow reviews?");
  res.send('show reviews of this user')
});

// doubts
app.post("/v1/profiles/:userId/:reviewId", (req, res) => {
  console.log("show one review?");
  res.send('show one review')
});

app.post("/v1/profiles/reviews", (req, res) => {
  console.log("Review Created?");
});

app.put("/v1/profiles/reviews/:reviewId", (req, re) => {
  console.log("review updated?");
});
///// doubts
app.post("/v1/profiles/:userId/details", (req, res) => {
  console.log("details card");
  res.send("details card of this user id");
});

app.post("/v1/profiles/:userId/newDetails", (req, res) => {
  console.log("Detail added");
  res.send("Details added");
});

app.put("/v1/profiles/:userId/details", (req, res) => {
  console.log("details updated");
  res.send("details updated");
});

app.delete("/v1/profiles/:userId/details", (req, res) => {
  console.log("details deleted ");
  res.send("details deleted");
});

app.put("/v1/profiles/:userId", (req, res) => {
  console.log("User edited");
  res.send("edited");
});

app.delete("v1//profiles/:userId", (req, res) => {
  console.log("Profile Deleted");
  res.send("deleted");
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
