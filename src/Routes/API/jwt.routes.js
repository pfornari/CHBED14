import { Router } from "express";
import passport from "passport";
import {
  failRegister,
  githubcallback,
  logUser,
  logout,
  register,
} from "../../Controllers/API/jwt.controller.js";

const router = Router();

router.post("/login", logUser);

// Register PassportLocal
router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "api/jwt/fail-register",
  }),
  register
);

//Logout

router.get("/logout", logout);

//Login con github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] })
);

//para volver desde la pagina de autorización de github a mi pagina

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "github/error",
  }),
  githubcallback
);

// //rutas de falla de registro o login:
router.get("/fail-register", failRegister);

// router.get("/fail-login", (req, res) => {
//   res.status(401).send({ error: "Falla al iniciar sesión" });
// });

export default router;
