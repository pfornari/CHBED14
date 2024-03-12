import config from "../config/config.js";
import nodemailer from "nodemailer";

import ticketDao from "../Services/DAOS/mongoDB/ticket.dao.js";

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
    console.log("error de verificación" + error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendEmail = async (id, email) => {
  try {
    const data = await ticketDao.findOneTicket(id);
    console.log(data);

    let result = transporter.sendMail({
      from: "Coder Backend PreEntrega - " + config.emailAcount,
      to: email,
      subject: "Comprobante Ticket de compra",
      html: `<div><h1> Ticket generado: ${data} </h1></div>`,
      attachments: [],
    });
    console.log(email);
    return result;
  } catch (error) {
    console.log(error);
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


export default nodemailer;