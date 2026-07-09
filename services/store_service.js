import { readJson, writeJson } from "./file_service.js";
import { createError } from "../utils/errors.js";

const DB_BASE_PATH = process.env.DB_BASE_PATH;
const STARTING_BALANCE = process.env.STARTING_BALANCE;

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
  let cust = customers.find((cust) => cust.customerId === customerId);
  if (!cust) {
    ((cust = {
      customerId,
      balance: STARTING_BALANCE,
      cart: [],
      createdAt: new Date(),
    }),
      customers.push(cust));
  }
  const books = await readJson(DB_BASE_PATH + "/books.json");
  const book = books.find((book) => book.id === bookId);
  if (!book) throw createError(404, `Book ${bookId} not found`);
  if (book.stock < quantity) throw createError(400, "Not enough in stock");
  const cart = cust.cart;
  let bookExistsInCart = false;
  for (const item of cart) {
    if (item.productId === bookId) {
      bookExistsInCart = true;
      item.quantity += quantity;
    }
  }
  if (bookExistsInCart === false) {
    cart.push({ productId: bookId, quantity: quantity });
  }
  await writeJson(DB_BASE_PATH + "/customers.json", customers);
}

export async function removeBookFromCart(customerId, bookId) {
  const customers = await readJson(DB_BASE_PATH + "/customers.json");
  const cust = customers.find((cust) => cust.customerId === customerId);
  if (!cust) throw createError(404, `customer ${customerId} not found`);
  const bookExistsInCart = cust.cart.find((item) => item.productId === bookId);
  if (!bookExistsInCart) {
    throw createError(400, "book is not in cart");
  }
  cust.cart = cust.cart.filter((item) => item.productId !== bookId);
  await writeJson(DB_BASE_PATH + "/customers.json", customers);
}

export async function checkout(customerId) {
  const customers = await readJson(DB_BASE_PATH + "/customers.json");
  const cust = customers.find((cust) => cust.customerId === customerId);
  if (!cust) throw createError(404, `Customer ${customerId} is not found`);
  if (cust.cart.length === 0) throw createError(400, "The cart is empty");
  let totalPrice = 0;
  let orderItems = [];
  const books = await readJson(DB_BASE_PATH + "/books.json");
  for (const item of cust.cart) {
    let itemExists = false;
    for (const book of books) {
      if (item.productId === book.id && book.stock >= item.quantity) {
        itemExists = true;
        book.stock -= item.quantity;
        totalPrice += book.price * item.quantity;
        orderItems.push({
          book_id: book.id,
          price: book.price,
          quantity: item.quantity,
        });
      }
    }
    if (itemExists === false)
      throw createError(400, `Product ${item.productId} is not in stock`);
  }
  if (totalPrice > cust.balance)
    throw createError(400, "You dont have enough money");
  cust.balance -= totalPrice;
  cust.cart = [];
  await createOrder(customerId, orderItems, totalPrice);
  await writeJson(DB_BASE_PATH + "/customers.json", customers);
  await writeJson(DB_BASE_PATH + "/books.json", books);
}

async function createOrder(customerId, items, totalPrice) {
  const orders = await readJson(DB_BASE_PATH + "/orders.json");
  const order = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    customerId: customerId,
    items: items,
    total: totalPrice,
    createdAt: new Date(),
  };
  orders.push(order);
  await writeJson(DB_BASE_PATH + "/orders.json", orders);
}

export async function getOrders(customerId) {
  let orders = await readJson(DB_BASE_PATH + "/orders.json");
  orders = orders.filter((order) => order.customerId === customerId);
  return orders;
}
