import CartDao from "./DAOS/mongoDB/cart.dao.js";
import ProductDao from "./DAOS/mongoDB/product.dao.js";
import TicketDao from "./DAOS/mongoDB/ticket.dao.js";

import CartRepository from "./Repository/cart.repository.js";
import ProductsRepository from "./Repository/products.repository.js";
import TicketRepository from "./Repository/ticket.repository.js";

//con esto cambiar de productDao a this.dao

// Generamos las instancias de las clases
const productDao = new ProductDao()
const cartDao = new CartDao()
const ticketDao = new TicketDao()

export const productService = new ProductsRepository(productDao)
export const cartService = new CartRepository(cartDao);
export const ticketService = new TicketRepository(ticketDao);
