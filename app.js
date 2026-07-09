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
  res.json({ mesaage: "Welcome to Online Bookstore" });
});

app.get("/helth", (req, res) => {
  res.json({ mesaage: "Server is very helthy" });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
