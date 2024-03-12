import { Router } from "express";
import {
  addProductToCart,
  changeProductQuantity,
  deleteCart,
  deleteProductFromCart,
  finalizarCompra,
  getCarts,
  getOneCart,
  postCart,
} from "../../Controllers/API/cart.controller.js";
import { passportCall, authorization } from "../../dirname.js";
const router = Router();

router.get("/", getCarts);

router.get("/:id", passportCall("jwt"), authorization("user"), getOneCart);

router.post("/", postCart);

router.post("/:id/product/:pid", addProductToCart);

router.put("/:cid/product/:pid", changeProductQuantity);

router.delete("/:cid", deleteCart);

router.delete("/:cid/product/:pid", deleteProductFromCart);

router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization("user"),
  finalizarCompra
);

export default router;
