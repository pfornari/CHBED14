import productDao from "../DAOS/mongoDB/product.dao.js";

class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = () => {
    return productDao.getAllProducts();
  };
  getById = (id) => {
    return productDao.getProductById(id);
  };
  getByCode = (code) => {
    return productDao.getProductByCode(code);
  };
  filter = (limit, page, category, stock) => {
    return productDao.filterProducts(limit, page, category, stock);
  };
  save = (product) => {
    return productDao.addProduct(product);
  };
  update = (id, product) => {
    return productDao.modifyProduct(id, product);
  };
  delete = (id) => {
    return productDao.deleteProduct(id);
  };
}

export default new ProductsRepository();
