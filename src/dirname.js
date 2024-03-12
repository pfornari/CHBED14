import path from "path";

import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import passport from "passport";

import config from "./config/config.js";
import nodemailer from "nodemailer";

import ticketDao from "./Services/DAOS/mongoDB/ticket.dao.js";
//faker en español:
import { fakerES as faker } from "@faker-js/faker";

import winston from "winston";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//separar en carpeta utils

//generamos la encriptación de contraseña, de manera sincrónica:
export const createHash = (hashPass) =>
  bcrypt.hashSync(hashPass, bcrypt.genSaltSync(10));

//validamos la encriptación:

export const validatePass = (user, hashPass) => {
  return bcrypt.compareSync(hashPass, user.password);
};

//JWT

export const PRIVATE_KEY = config.privateKey;

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "300s" });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    logger.debug(`Entrando a llamar strategy ${strategy}`);

    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      
      next();
    })(req, res, next);
  };
};

export const authToken = (req, res, next) => {
  //El JWT token se guarda en los headers de autorización.
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1]; //Se hace el split para retirar la palabra Bearer.
  //Validar token
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Token invalido." });
    //Token OK
    req.user = credentials.user;

    next();
  });
};

//autorizamos quien puede ver las paginas segun el rol
export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");
    if (req.user.role.includes(role)) {
      return next();
    }

    return res
      .status(403)
      .send("Forbidden: El usuario no tiene permisos con este rol.");
  };
};

//NODEMAILER:
// configuracion de transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.emailAcount,
    pass: config.appPassword,
  },
});

// Verificamos conexion con gmail
transporter.verify(function (error, success) {
  if (error) {
    logger.error(`Error de verificación ${error}`);
  } else {
    logger.info("Server is ready to take our messages");
  }
});

export const sendEmail = async (id, email) => {
  try {
    const data = await ticketDao.findOneTicket(id);
    // console.log(data);
    logger.info(data);

    let result = transporter.sendMail({
      from: "Coder Backend PreEntrega - " + config.emailAcount,
      to: email,
      subject: "Comprobante Ticket de compra",
      html: `<div><h1> Ticket generado: ${data} </h1></div>`,
      attachments: [],
    });
    logger.info(`Email: ${email}`);
    // console.log(email);
    return result;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

//Más adelante adjuntar el ticket además de mandarlo en el cuerpo:

// const mailOptionsWithAttachments = {
//     from: "Coder Test - " + config.gmailAccount,
//     to: `${config.gmailAccount};enzozanino2000@gmail.com; leo1987@yopmail.com`,
//     subject: "Correo de prueba CoderHouse Pkrogramacion BackEnmd clase30",
//     html: `<div>
//                 <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
//                 <p>Ahora usando imagenes: </p>
//                 <img src="cid:meme"/>
//             </div>`,
//     attachments: [
//         {
//             filename: 'Meme de programacion',
//             path: __dirname + '/public/images/meme.png',
//             cid: 'meme'
//         }
//     ]
// }

// export const sendEmailWithAttachments = (req, res) => {
//     try {
//         let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
//             if (error) {
//                 console.log(error);
//                 res.status(400).send({ message: "Error", payload: error });
//             }
//             console.log('Message sent: %s', info.messageId);
//             res.send({ message: "Success", payload: info })
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
//     }
// }

//Mocking:

export const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1000, max: 8000, dec: 0 }),
    code: faker.location.zipCode(),
    status: faker.datatype.boolean(),
    category: faker.commerce.department(),
    stock: faker.finance.amount({ min: 1, max: 100, dec: 0 }),
    thumbnails: faker.image.urlLoremFlickr({ width: 128, height: 128 }),
  };
};

//creo un objeto custom con las propiedades que quiera
const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "black",
    warning: "yellow",
    info: "blue",
    http: "white",
    debug: "green",
  },
};

winston.addColors(customLevelOptions.colors);

//Logger:
const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: config.maxLevelConsole,

      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: config.maxLevelFile,
    }),
  ],
});

//middleware de logger:
export const addLogger = (req, res, next) => {
  req.logger = logger;

  //lo que quiero registrar en los logs. En este caso ${método} en ${ruta} at ${fecha y hora}
  req.logger.http(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`
  );

  next();
};

export default __dirname;
