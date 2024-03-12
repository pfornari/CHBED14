import { validatePass, generateJWToken } from "../../dirname.js";
import config from "../../config/config.js";
import { userModel } from "../../Services/Models/user.model.js";

export const register = async (req, res) => {
  req.logger.info("Registrando usuario");
  res
    .status(201)
    .send({ status: "success", message: "Usuario creado con éxito." });
};

export const logUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await userModel.findOne({ email: email });
    // const userExists = await UserRepository.logUser(email, password);
    if (!userExists) {
      req.logger.error(`User doesn't exist: ${email}`);
      return res.status(204).send({
        error: "User not found",
        message: "Usuario no encontrado: " + email,
      });
    }
    if (!validatePass(userExists, password)) {
      req.logger.error(`Invalid credentials for user: ${email}`);
      return res.status(401).send({
        status: "error",
        error: "Credenciales incorrectas",
      });
    }

    const tokenUser = {
      name: `${userExists.first_name} ${userExists.last_name}`,
      email: userExists.email,
      age: userExists.age,
      role: userExists.rol,
      cart: userExists.cart._id,
    };

    const access_token = generateJWToken(tokenUser);
    req.logger.info(`El token es: ${access_token}`)
    req.logger.info(`El rol es ${tokenUser.role}`)

    //el primer parámetro es el nombre de la cookie, el segundo es la info que contiene, el tercero su configuración
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 120000,
      httpOnly: true, //No se expone la cookie
    });
    req.logger.info(`cookie creada`)

    if (userExists.email === config.adminMail) {
         req.logger.info(`Admin obtenido: ${userExists}`);
      return res.status(201).send({ message: "Login admin successful" });
    }
    req.logger.info(`Usuario obtenido: ${userExists}`);
    res.status(200).send({ message: "Login user successful" });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).send({
      status: "error",
      error: "Error interno de la applicacion.",
    });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "Error de logout", msg: "Error al cerrar la session" });
    }
    req.logger.info("Se ha cerrado la sesión")
    res.status(200).send("Se ha cerrado la sesión");
  });
};

export const githubcallback = async (req, res) => {
  const userExists = req.user;

  const tokenUser = {
    first_name: userExists.first_name,
    last_name: userExists.last_name,
    age: userExists.age,
    email: userExists.email,
    role: userExists.rol,
  };
  const access_token = generateJWToken(tokenUser);
  res.cookie("jwtCookieToken", access_token, {
    maxAge: 120000,
    httpOnly: true,
  });

  if(userExists.rol.includes("user")){
    return res.redirect("/users/products");
  } else if(userExists.rol.includes("admin")){
     return res.redirect("/api/products");
  } else {
    return res.redirect("/products")
  }
  
};

export const failRegister = (req, res) => {
  res.status(401).send({ error: "Falla al registrarse" });
};
