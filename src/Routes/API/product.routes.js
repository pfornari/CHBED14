import { Router } from "express";
import {
  getAdminProducts,
  getOneProduct,
  postProduct,
  changeProduct,
  deleteProduct,
} from "../../Controllers/API/products.controller.js";
import {
  getEditForm,
  getProductForm,
} from "../../Controllers/VIEWS/admin.views.controller.js";
import { passportCall, authorization } from "../../dirname.js";

const router = Router();

router.get(
  "/",

  passportCall("jwt"),
  authorization("admin"),
  getAdminProducts
);

router.get(
  "/addProduct",
  passportCall("jwt"),
  authorization("admin"),
  getProductForm
);

router.get(
  "/editProduct/:id",
  passportCall("jwt"),
  authorization("admin"),
  getEditForm
);

router.get("/:id", getOneProduct);

router.post("/", passportCall("jwt"), authorization("admin"), postProduct);

router.put("/:id", passportCall("jwt"), authorization("admin"), changeProduct);

router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  deleteProduct
);

export default router;
