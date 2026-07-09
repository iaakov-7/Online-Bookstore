import express from "express";
import { checkout } from "../services/store_service.js";

export const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const customerId = parseInt(req.body.customerId);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: "CustomerId must be an integer number",
      });
    }
    await checkout(customerId);
    res
      .status(201)
      .json({ success: true, message: "Checkout completed successfully" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Internal server error",
    });
  }
});
