export const getProductForm = async (req, res) => {
  res.render("addProduct", { fileCss: "register.css" });
};

export const getEditForm = async (req, res) => {
  res.render("editProduct", { fileCss: "register.css" });
};
