import express from "express";
import { getBooks } from "../services/store_service.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { inStock, maxPrice, search } = req.query;
    const books = await getBooks(inStock, maxPrice, search);
    res.json({ success: true, books });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
