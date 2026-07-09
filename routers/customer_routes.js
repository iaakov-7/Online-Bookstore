import express from "express";
import { getCustomerById, addBookToCart } from "../services/store_service.js";
import { validateAddToCart } from "../validator.js";

export const router = express.Router();

router.get("/cart", async (req, res) => {
  try {
    const customerId = req.query.customerId;
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
    const valhdation = validateAddToCart(customerId, productId, quantity);
    if (!valhdation.isValid) {
      res.status(400).json({ success: false, message: valhdation.errors });
    }
    const addToCart = await addBookToCart(customerId, productId, quantity);
    if (addToCart === "cust not found") {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    if (addToCart === "book not found") {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    if (addToCart === "not enough stock") {
      return res
        .status(400)
        .json({ success: false, message: "not enough stock" });
    }

    res
      .status(201)
      .json({ success: true, message: "Book added to cart successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
