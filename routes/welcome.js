import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.status(200).json({
      welcomeMessage:
        "Welcome to Inventory! You've reached the API. There's not much to see here but feel free to visit the app at the following URL.",
      checkOutTheApp:
        "http://inventory-v.0.0.1.s3-website-us-east-1.amazonaws.com/",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error,
      });
    }
  }
});

export default router;
