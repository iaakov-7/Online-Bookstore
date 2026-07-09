import express from "express";
import "dotenv/config";
import { router as bookRouter } from "./routers/books_routes.js";
import { router as customerRouter } from "./routers/customers_routes.js";
import { router as orderRouter } from "./routers/orders_routes.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/books", bookRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);

app.get("/", (req, res) => {
  res.json({ success: true, mesaage: "Welcome to Online Bookstore" });
});

app.get("/health", (req, res) => {
  res.json({ success: true, mesaage: "Server is very helthy" });
});

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `route ${req.url} not found` });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
