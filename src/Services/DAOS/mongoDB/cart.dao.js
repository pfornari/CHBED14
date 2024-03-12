import { cartModel } from "../../Models/cart.model.js";
import mongoose from "mongoose";
import __dirname from "../../../dirname.js";

class CartDao {
  async findCart() {
    return await cartModel.find();
  }

  async findCartById(_id) {
    try {
      
      if (mongoose.Types.ObjectId.isValid(_id)) {
        let result = await cartModel.findById(_id).populate("products._id");
        return result;
      }
      return { error: "Id format not valid" };
    } catch (error) {
      return error
    }
  }

  async createCart(cart) {
    try {
      const newCart = await cartModel.create(cart);
      return newCart;
    } catch (error) {
      return error
    }
  }

  async addProductToCart(_id, _pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

        const productoRepetido = cartFound.products.find(
          (producto) => producto._id == _pid
        );

        if (productoRepetido) {
          productoRepetido.quantity++;

          const result = await cartModel.findByIdAndUpdate(
            { _id: cartFound._id },
            cartFound
          );
          return;
        }

        const prodAgregado = cartFound.products.push(_pid);

        const result = await cartModel.findByIdAndUpdate(
          { _id: cartFound._id },
          cartFound
        );
        return result;
      }
      console.log("Id format not valid");
      return;
    } catch (error) {
      return error
    }
  }

  async updateCart(_id, cart) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

        return await cartModel.findByIdAndUpdate({ _id }, cart);
      }
      console.log("Id format not valid");
    } catch (error) {
      return error
    }
  }

  async updateOneProduct(_id, _pid, quantity) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

          const productoBuscado = cartFound.products.find(
            (producto) => producto._id == _pid
          );
          let prodEncontrado;

          if (productoBuscado) {
            productoBuscado.quantity = quantity;
            const result = await cartModel.findByIdAndUpdate(
              { _id: cartFound._id },
              cartFound
            );

            
            return (prodEncontrado = true);
          }
          console.log("Product doesn't exist");
          return (prodEncontrado = false);
        
      }
      console.log("Id format not valid");
    } catch (error) {
      return error
    }
  }

  async deleteCart(_id) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });
        cartFound.products = [];

        return await cartModel.findByIdAndUpdate({ _id }, cartFound);
      }
      console.log("Id format not valid");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOneProduct(_id, _pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const cartFound = await cartModel.findById({ _id });

          const productoBuscado = cartFound.products.find(
            (producto) => producto._id == _pid
          );

          if (productoBuscado) {
            productoBuscado.deleteOne();
            const result = await cartModel.findByIdAndUpdate(
              { _id: cartFound._id },
              cartFound
            );

            return result;
          }
          // console.log("Product doesn't exist");
          return;
        
      }
      console.log("Id format not valid");
    } catch (error) {
      console.log(error);
    }
  }

  async getTotal(cart) {
    const cartFound = await this.findCartById(cart._id);

    const total = await cartFound.products.reduce((acc, elemento) => {
      return acc + elemento.quantity * elemento._id.price;
    }, 0);

    return total;
  }
}

export default new CartDao();
