import express from "express";
import "dotenv/config";
import { router as bookRouter } from "./routers/books_routes.js";

const PORT = process.env.PORT;

const app = express();

app.use("/books", bookRouter);

app.get("/", (req, res) => {
  res.json({ mesaage: "Welcome to Online Bookstore" });
});

app.get("/helth", (req, res) => {
  res.json({ mesaage: "Server is very helthy" });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
