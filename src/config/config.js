import dotenv from "dotenv"
import program from "../process.js";

const environment = program.opts().mode
const persistence = program.opts().persist

dotenv.config({
    path: environment === "prod" ? "./src/config/.env.prod" : "./src/config/.env.dev"
})

console.log("Modo de persistencia en " + persistence)


export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  secret: process.env.secret,
  privateKey: process.env.PRIVATE_KEY,
  adminMail: process.env.ADMIN_MAIL,
  adminPass: process.env.ADMIN_PASSWORD,
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL,
  persistence: persistence,
  emailAcount: process.env.cuentadegmail,
  appPassword: process.env.APP_PASSWORD,
  maxLevelConsole: process.env.LEVEL_CONSOLE,
  maxLevelFile: process.env.LEVEL_FILE
};