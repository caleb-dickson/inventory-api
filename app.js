import path from "path";
import express from "express";
import BodyParser from "body-parser";
import mongoose from "mongoose";

import userRoutes from "./routes/user.js";
import businessRoutes from "./routes/business.js";
import locationRoutes from "./routes/location.js";

const app = express();

mongoose
  .connect(
    "mongodb+srv://cdickson:" +
      process.env.MONGO_DB_PW +
      "@inventory-app.ctjsr.mongodb.net/inventory-app?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));
// app.use("/images/users", express.static(path.join("images")));
// NEED ADDITIONAL PATHS FOR OTHER IMAGES ^^^

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/location", locationRoutes);

export default app;
