import express from "express";
import {
  getCustomerById,
  addBookToCart,
  removeBookFromCart,
} from "../services/store_service.js";
import { validateAddToCart } from "../utils/validator.js";

export const router = express.Router();

router.get("/cart", async (req, res) => {
  try {
    const customerId = parseInt(req.query.customerId);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: "customerId must be an integer number",
      });
    }
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    const cart = customer.cart;
    res.json({ success: true, cart });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/cart/items", async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const validation = validateAddToCart(customerId, productId, quantity);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validation.errors });
    }
    const addedToCart = await addBookToCart(customerId, productId, quantity);
    res
      .status(201)
      .json({ success: true, message: "Book added to cart successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.status ? err.message : "Internal server error",
    });
  }
});

router.delete("/cart/items/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "productId must be a number" });
    }
    const customerId = parseInt(req.body.customerId);
    if (isNaN(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "customerId must be a number" });
    }
    const removed = await removeBookFromCart(customerId, productId);

    res.json({ success: true, message: "Book removed from cart successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Internal server error",
    });
  }
});

router.get("/account/balance", async (req, res) => {
  try {
    const customerId = parseInt(req.query.customerId);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: "customerId must be an integer number",
      });
    }
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    const balance = customer.balance;
    res.json({ success: true, balance: balance });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
