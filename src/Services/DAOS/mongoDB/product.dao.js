import { productModel } from "../../Models/product.model.js";
import mongoose from "mongoose";

class ProductDao {
  async getAllProducts() {
    try {
      return await productModel.find();
    } catch (error) {
      return error;
    }
  }

  async getProductById(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const productFound = await productModel.findById({ _id });

        if (productFound) {
          return await productModel.findById({ _id });
        }
        return "Product not found";
      }
      console.log("Formato de id no válido");
    } catch (error) {
      return error;
    }
  }

  async getProductByCode(code) {
    try {
      const productFound = await productModel.findOne({ code });
      return productFound;
    } catch (error) {
      return error;
    }
  }

  async filterProducts(limit, page, category, stock) {
    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (stock) {
      filter.stock = stock;
    }

    const products = await productModel.paginate(filter, {
      page: page || 1,
      limit: limit || 10,
      sort: { price: 1 },
    });

    return products;
  }

  async addProduct(nuevoProducto) {
    try {
      return await productModel.create(nuevoProducto);
    } catch (error) {
      console.log(error);
    }
  }

  async modifyProduct(_id, newProduct) {
    try {
      console.log(_id, newProduct);
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const productFound = await productModel.findById({ _id });

        if (productFound) {
          return await productModel.findByIdAndUpdate({ _id }, newProduct);
        }
        return "Product not found";
      }
      console.log("Formato de id no válido");
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const productFound = await productModel.findById({ _id });

        if (productFound) {
          return await productModel.findByIdAndDelete({ _id });
        }
        return "Product not found";
      }
      console.log("Formato de id no válido");
    } catch (error) {
      return error;
    }
  }
}

export default new ProductDao();
