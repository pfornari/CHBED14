import { Router } from "express";
import {
  getChat,
  home,
} from "../../Controllers/VIEWS/general.views.controller.js";
import { passportCall, authorization } from "../../dirname.js";
import { getProducts } from "../../Controllers/API/products.controller.js";

const router = Router();

router.get("/", home);

router.get("/chat", passportCall("jwt"), authorization("user"), getChat);

router.get("/products", getProducts);

export default router;
