import { readJson, writeJson } from "./file_service.js";

const DB_BASE_PATH = process.env.DB_BASE_PATH;

export async function getBooks(inStock, maxPrice, search) {
  let books = await readJson(DB_BASE_PATH + "/books.json");
  if (inStock) books = books.filter((book) => book.stock > 0);
  if (maxPrice) books = books.filter((book) => book.price <= maxPrice);
  if (search) books = books.filter((book) => book.name.includes(search));
  return books;
}
