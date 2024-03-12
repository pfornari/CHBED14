import passport from "passport";
import passportLocal from "passport-local";
import { createHash, validatePass, PRIVATE_KEY } from "../dirname.js";
import { userModel } from "../Services/Models/user.model.js";
import jwtStrategy from "passport-jwt";
import GitHubStrategy from "passport-github2";
import config from "./config.js";
import cartDao from "../Services/DAOS/mongoDB/cart.dao.js";
import __dirname from "../dirname.js";



//Declaramos la estrategia (qué tipo de passport voy a usar)
const localStrategy = passportLocal.Strategy;

//Declaramos estrategias de jwt
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

//inicializamos passport
const inicializePassport = () => {
  //Estrategia de obtener Token JWT por Cookie:
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
         try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //estrategia con github:

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackUrl: config.callbackURL,
      },
      //estos parámetros son propios de passport
      async (accesstoken, refreshtoken, profile, done) => {
        console.log("perfil de usuario obtenido:");
        console.log(profile);
        // req.logger.info("hola")
        try {
          const userExists = await userModel.findOne({
            email: profile._json.email,
          });
          if (!userExists) {
            console.log(
              "Este usuario no se ha registrado con github. Se creará una nueva cuenta" + profile._json.email
            );
            //el usuario no existe, entonces lo registro

            let cart = {};

            const newCart = await cartDao.createCart(cart);

            if (profile._json.email === config.adminMail) {
              let newUser = {
                first_name: profile._json.name,
                last_name: profile._json.last_name || ".",
                age: profile._json.age || 100,
                email: profile._json.email,
                password: "",
                rol: "admin",
                cart: newCart,
                loggedBy: "github",
              };

              const result = await userModel.create(newUser);
              return done(null, result);
            }

            let newUser = {
              first_name: profile._json.name,
              last_name: profile._json.last_name || ".",
              age: profile._json.age || 100,
              email: profile._json.email,
              password: "",
              cart: newCart,
              loggedBy: "github",
            };


            const result = await userModel.create(newUser);
            return done(null, result);
          } else {
            //el usuario ya existe en la db, entonces lo logueo
            return done(null, userExists);
          }
        } catch (error) {
          return done("Error de github strategy" + error);
        }
      }
    )
  );

  //para register:

  passport.use(
    "register",
    new localStrategy(
      //como es un callback, hago que cuando termine vuelva a la parte de register en la ruta de sesión.
      //Y cambio el parámetro usernameField a email.
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        //le paso lo que tenía en la ruta register
        const { first_name, last_name, age, email } = req.body;
        try {
          const userExists = await userModel.findOne({ email });
          if (userExists) {
            req.logger.error("El usuario ya existe")

            //null es porque no hay un error, false es porque el usuario ya existe
            done(null, false);
          }

          
          let cart = {};

          const newCart = await cartDao.createCart(cart);

        
          //valido registro como admin:
          if (email === config.adminMail) {
            const user = {
              first_name,
              last_name,
              age,
              email,
              password: createHash(password),
              rol: "admin",
              cart: newCart,
              loggedBy: "passportLocal",
            };

            const result = await userModel.create(user);
            return done(null, result);
          }

          const user = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            cart: newCart,
            loggedBy: "passportLocal",
          };

          const result = await userModel.create(user);
          return done(null, result);
        } catch (error) {
          // console.log(error);
          req.logger.error(error)
          return done("Error de register" + error);
        }
      }
    )
  );

  //funciones de serialización propias de passport:

  passport.serializeUser((userExists, done) => {
    done(null, userExists._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.log("error al deserializar" + error);
    }
  });
};

const cookieExtractor = (req) => {
  let token = null;

  req.logger.debug("Entrando a cookie extractor")

  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  
    return token;
  }
  req.logger.warning("No se encontraron cookies")
  return token;
};

export default inicializePassport;
