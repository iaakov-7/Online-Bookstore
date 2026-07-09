import express from "express";
import { checkout, getOrders } from "../services/store_service.js";

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

router.get("/", async (req, res) => {
  try {
    const customerId = parseInt(req.query.customerId);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: "CustomerId must be an integer number",
      });
    }
    const orders = await getOrders(customerId);
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Customer ${customerId} have no orders`,
      });
    }
    res.json({ success: true, orders: orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
