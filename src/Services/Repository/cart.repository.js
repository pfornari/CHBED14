import cartDao from "../DAOS/mongoDB/cart.dao.js";
//ver si usando factory puedo cambiar cartDao por this.dao.
class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => {
    return await cartDao.findCart();
  };
  getById = (cid) => { 
    return cartDao.findCartById(cid);
  };
  save = (cart) => {
    return cartDao.createCart(cart);
  };
  addProduct = (cid, pid) => {
    return cartDao.addProductToCart(cid, pid);
  };
  update = (cid, cart) => {
    return cartDao.updateCart(cid, cart);
  };
  updateProduct = (cid, pid, quantity) => {
    return cartDao.updateOneProduct(cid, pid, quantity);
  };
  delete = (cid) => {
    return cartDao.deleteCart(cid);
  };
  deleteProduct = (cid, pid) =>{
    return cartDao.deleteOneProduct(cid, pid);
  };
  getTotal = (cart) => {
    return cartDao.getTotal(cart);
  }
}


export default new CartRepository();
