import ProductsRepository from "../../Services/Repository/products.repository.js";
import CustomError from "../../Services/errors/customError.js";
import EErrors from "../../Services/errors/error-dictionary.js";
import { generateProductErrorInfoES, repetedCodeErrorInfo } from "../../Services/errors/messages/productSave.msg.js";

//PARA PÚBLICO EN GENERAL (sin mostrar datos de cuenta)
export const getProducts = async (req, res) => {
  const { limit, page, category, stock } = req.query;
  try {
    const products = await ProductsRepository.filter(
      limit,
      page,
      category,
      stock
    );

    res.status(200).render("productsLibre", {
      products,
      fileCss: "index.css",
    });
  } catch (error) {
  
  req.logger.error(error.cause);
  return res.status(500).send({ error: error.code, message: error.message });
    // console.log(error);
    // return res.status(500).send({
    //   messsage: "Error getting products",
    //   error: error,
    // });
  }
};

//PARA ADMIN (sin carrito):
export const getAdminProducts = async (req, res) => {
  const { limit, page, category, stock } = req.query;
  try {
    const products = await ProductsRepository.filter(
      limit,
      page,
      category,
      stock
    );

    res.status(200).render("productsAdmin", {
      user: req.user.name,
      role: req.user.role,
      products,
      fileCss: "index.css",
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
  }
};

//PARA USERS:
export const getUserProducts = async (req, res) => {
  const { limit, page, category, stock } = req.query;
  try {
    const products = await ProductsRepository.filter(
      limit,
      page,
      category,
      stock
    );

    res.status(200).render("products", {
      user: req.user.name,
      role: req.user.role,
      cart: req.user.cart,
      products,
      fileCss: "index.css",
    });
  } catch (error) {
   req.logger.error(error.cause);
   return res.status(500).send({ error: error.code, message: error.message });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductsRepository.getById(id);
    //hacer render con vista del producto individual
    res.status(201).json({
      product,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({ error: error.code, message: error.message });
    // console.log(error);
    // return res.status(500).send({
    //   messsage: `Error getting product ${id}`,
    //   error: error,
    // });
  }
};

export const postProduct = async (req, res) => {
    try {
      const { title, description, price, code, category, stock, thumbnails } =
        req.body;
      const datosProducto = {
        title,
        description,
        price,
        code,
        category,
        stock,
        thumbnails,
      };
      // console.log(datosProducto);
      
      req.logger.info(`producto ingresado: ${datosProducto}`);

//falta error de codigo unico
      if (!title || !description || !price || !code || !category || !stock) {
        CustomError.createError({
          name: "Error de ingreso de datos",
          cause: generateProductErrorInfoES(datosProducto),
          message: "Error ingresando los datos del producto.",
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }
      const codeExists = await ProductsRepository.getByCode(code)
      if(codeExists){
        CustomError.createError({
          name: "El código ya existe",
          message: "El código debe ser único",
          cause: repetedCodeErrorInfo(code),
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      const product = await ProductsRepository.save(datosProducto);
      res.status(201).json({
        product,
      });
    } catch (error) {
      req.logger.error(error.cause)
      return res
        .status(500)
        .send({ error: error.code, message: error.message });
    }
};

export const changeProduct = async (req, res) => {
  const { id } = req.params;
  const datosProducto = req.body;

  try {
    req.logger.info(id, datosProducto);
    const product = await ProductsRepository.getById(id).then(
      ProductsRepository.update(id, datosProducto)
    );

    res.status(201).json({
      product,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({
      messsage: `Error updating product ${id}`,
      error: error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductsRepository.getById(id).then(
      ProductsRepository.delete(id)
    );
    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    }
    req.logger.info(`Product ${id} deleted`)
    res.status(200).send({
      message: "Product deleted",
      product,
    });
  } catch (error) {
    req.logger.error(error.cause);
    return res.status(500).send({
      messsage: "Error deleting products",
      error: error,
    });
  }
};
