# Online-Bookstore 📚

## About the project

Server for online books store who manage customers, products, orders, and shopping carts,
The data is saving on local json files, the project has written in Java Script by Y.V.

## Installing dependent libraries

npm install

## Setting environment variables

Create a .env file and set the environment variables according to the fields in .env_example file

## How to run

node app.js

## Folders structure

```
|-db/
| |-books.json // books storage
| |-customers.json // customers storage
| |-orders.json // orders storage
|
|-routers/
| |-books_routes.js // handle books routes
| |-customers_routes.js // handle customers routes
| |-orders_routes.js // handle orders routes
|
|-services/
| |-file_service.js // handle input and output for files
| |-store_service.js // handle actions and logic for routes
|
|-utils/
| |-errors.js // creating errors
| |-validator.js // validation for add to cart
|
|-.env // environment variables
|-.gitignore // all files that not upload to githab
|-app.js // config server and main file
|-package-lock.json // automatically generated file that locks dependencies and versions
|-package.json // project's metadata and libraries dependencies and versions
|-README.md // project documentation
```

## API routes(endpoints)

- I added a `customers` prefix to some of the routes for clear division.

Methode | Route | Description

- `GET` | `/` | Opening statement
- `GET` | `/health` | Server health check
- `GET` | `/books` | Displays the products list, supporting query- `inStock`, `maxPrice`, `search`
- `GET` | `/customers/cart` | Displays a customer's shopping cart by query- `customerId`
- `POST` | `/customers/cart/items`| Adds a product to the customer's cart, required body with - `customerId`, `productId`,`quantity`
- `DELETE` | `/customers/cart/items/:productId`| Removes a product from the customer's cart, required body with - `customerId`
- `GET` | `/customers/account/balance` | Displays the customer's current balance by query- `customerId`
- `POST` | `/orders/checkout` | Perform checkout and create a new order, required body with - `customerId`
- `GET` | `/orders` | Displays the customer's order history by query- `customerId`
