import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET genz picks
router.get("/genz", async (req, res) => {
  const products = await Product.find({ category: "genz" });
  res.json(products);
});

// POST product (temporary for testing)
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  const saved = await newProduct.save();
  res.json(saved);
});

export default router;
