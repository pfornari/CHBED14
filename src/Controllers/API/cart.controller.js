import { sendEmail } from "../../dirname.js";
import CartRepository from "../../Services/Repository/cart.repository.js";
import TicketRepository from "../../Services/Repository/ticket.repository.js";
import productsRepository from "../../Services/Repository/products.repository.js";
import EErrors from "../../Services/errors/error-dictionary.js";
import CustomError from "../../Services/errors/customError.js";
import {
  emptyCart,
  invalidIDError,
} from "../../Services/errors/messages/cartErrors.msg.js";

//agregar validacion de si no existe el producto

export const getCarts = async (req, res) => {
  try {
    const carts = await CartRepository.getAll();

    res.json({
      message: "These are the carts:",
      data: carts,
    });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const getOneCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await CartRepository.getById(id);

    let totalPrice = await CartRepository.getTotal(cart);

    let products = cart.products;
    req.logger.info(`Cart ID: ${id}`);
    res.render("cartView", {
      cart: id,
      message: `This is the cart with id ${id}:`,
      products,
      amount: totalPrice,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const postCart = async (req, res) => {
  try {
    const cart = await CartRepository.save();
    res.send({
      data: cart,
    });
  } catch (error) {
    req.logger.error(error);
    res.send({
      message: "Couldn't create cart",
      error: error,
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { pid } = req.params;

    const cart = await CartRepository.getById(id);
    if (cart) {
      CartRepository.addProduct(id, pid);
      req.logger.info(`product ${pid} added to cart`);

      return res.status(200).json({
        message: `Product ${pid} added to cart ${id}`,
        cart,
      });
    }
    return CustomError.createError({
      name: "No se encontró el carrito",
      message: "El id del carrito no existe en la base de datos.",
      cause: invalidIDError(id),
      code: EErrors.DATABASE_ERROR,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const changeProductQuantity = async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await CartRepository.getById(cid);
    if (cart) {
      CartRepository.updateProduct(cid, pid, quantity);
      console.log(prodEncontrado)
      if ((prodEncontrado === true)) {
        req.logger.info(`Product ${pid} updated`);
        return res.json({
          cart,
        });
      }
        req.logger.error(`Product ${pid} not found`)
        return 
        //custom error de producto no encontrado
    }
    return CustomError.createError({
      name: "No se encontró el carrito",
      message: "El id del carrito no existe en la base de datos.",
      cause: invalidIDError(id),
      code: EErrors.DATABASE_ERROR,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await CartRepository.getById(cid);
    if (cart) {
      CartRepository.delete(cid);
      req.logger.debug(`Cart ${cid} is empty`)
      return res.status(200).json({
        cart,
      });
    }
    return CustomError.createError({
      name: "No se encontró el carrito",
      message: "El id del carrito no existe en la base de datos.",
      cause: invalidIDError(id),
      code: EErrors.DATABASE_ERROR,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;

  try {
    const cart = await CartRepository.getById(cid);
    if (cart) {
      CartRepository.deleteProduct(cid, pid);
      if(result){
        req.logger.debug(`Product ${pid} deleted`)
         return res.json({
           data: cart,
         });
      }
      req.logger.error(`Product ${pid} doesn't exist`)
      // res.status(404).send({message: "Product doesn't exists"})
     return CustomError.createError({
       name: "No se encontró el producto",
       message: "El id del producto no existe en la base de datos.",
       cause: invalidIDError(id),
       code: EErrors.DATABASE_ERROR,
     });
    }
    return CustomError.createError({
      name: "No se encontró el carrito",
      message: "El id del carrito no existe en la base de datos.",
      cause: invalidIDError(id),
      code: EErrors.DATABASE_ERROR,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const finalizarCompra = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartRepository.getById(cid);
    if (cart) {
      const amount = await CartRepository.getTotal(cart);
      if (amount !== 0) {
        const purchase_datetime = new Date();
        const ticket = {
          amount,
          cart,
          purchaser: req.user.email,
          purchase_datetime,
        };

        cart.products.map((product) =>
          //genero un nuevo producto con el stock reducido
          {
            const newProduct = {
              title: product._id.title,
              description: product._id.description,
              price: product._id.price,
              code: product._id.code,
              category: product._id.category,
              stock: product._id.stock - product.quantity,
              thumbnails: product._id.thumbnails,
            };
            // console.log(newProduct)
            productsRepository.update(product._id._id, newProduct);
          }
        );

        const result = await TicketRepository.save(ticket);

        sendEmail(result.id, req.user.email);

        const ticketGenerado = await TicketRepository.getById(result._id);
        // console.log("Ticket generado: " + ticketGenerado);

        //Vacío el carrito:
        await CartRepository.delete(cid);
        return res.status(200).send({ result });
        // res.status(200).json({ ticketGenerado })
      }
      return CustomError.createError({
        name: "El carrito está vacío",
        message:
          "El carrito debe tener productos para poder finalizar la compra. ",
        cause: emptyCart(id),
        code: EErrors.DATABASE_ERROR,
      });
    }
    return CustomError.createError({
      name: "No se encontró el carrito",
      message: "El id del carrito no existe en la base de datos.",
      cause: invalidIDError(id),
      code: EErrors.DATABASE_ERROR,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};
