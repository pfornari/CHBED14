export const registerUser = async(req, res) => {
     res.render("register", {
       fileCss: "register.css",
     });
}


export const getUsers = async(req, res) => {
      res.render("profile", {
        role: req.user.role,
        user: req.user.name,
        age: req.user.age,
        email: req.user.email,
        cart: req.user.cart
      });
      
   

}


