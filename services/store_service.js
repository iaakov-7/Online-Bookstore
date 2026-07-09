import { readJson, writeJson } from "./file_service.js";

const DB_BASE_PATH = process.env.DB_BASE_PATH;

export async function getBooks(inStock, maxPrice, search) {
  let books = await readJson(DB_BASE_PATH + "/books.json");
  if (inStock) books = books.filter((book) => book.stock > 0);
  if (maxPrice) books = books.filter((book) => book.price <= maxPrice);
  if (search) books = books.filter((book) => book.name.includes(search));
  return books;
}

export async function getCustomerById(customerId) {
  const customers = await readJson(DB_BASE_PATH + "/customers.json");
  const cust = customers.find((cust) => cust.customerId === customerId);
  return cust;
}

export async function addBookToCart(customerId, bookId, quantity) {
  const customers = await readJson(DB_BASE_PATH + "/customers.json");
  const cust = customers.find((cust) => cust.customerId === customerId);
  if (!cust) return "cust not found";
  const books = await readJson(DB_BASE_PATH + "/books.json");
  const book = books.find((book) => book.id === bookId);
  if (!book) return "book not found";
  if (book.stock < 0) return "not enough stock";
  const cart = cust.cart;
  let existsInCart = false;
  for (const item of cart) {
    if (item.productId === bookId) {
      existsInCart = true;
      item.quantity += quantity;
    }
  }
  if (existsInCart === false) {
    cart.push({ productId: bookId, quantity: quantity });
  }
  await writeJson(DB_BASE_PATH + "/customers.json", customers);
}
