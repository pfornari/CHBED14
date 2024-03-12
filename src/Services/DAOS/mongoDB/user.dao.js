// import { userModel } from "../../Models/user.model.js";
// import { validatePass, generateJWToken } from "../../../dirname.js";


// class UserDao {
//   async logUser(email, password) {
//     try{
//         const userExists = await userModel.findOne({ email: email });

//         if (!userExists) {
//           console.warn(`User doesn't exist: ${email}`);
//           return false
//         }
//         if (!validatePass(userExists, password)) {
//           console.warn(`Invalid credentials for user: ${email}`);
//           return false
//         }

//         const tokenUser = {
//           name: `${userExists.first_name} ${userExists.last_name}`,
//           email: userExists.email,
//           age: userExists.age,
//           role: userExists.rol,
//           cart: userExists.cart._id,
//         };

//         const access_token = generateJWToken(tokenUser);
//         console.log("el token es:" + access_token);
//         return access_token
//         //el primer parámetro es el nombre de la cookie, el segundo es la info que contiene, el tercero su configuración
//         // res.cookie("jwtCookieToken", access_token, {
//         //   maxAge: 120000,
//         //   httpOnly: true, //No se expone la cookie
//         // });

//         // if (userExists.email === config.adminMail) {
//         //   return res.status(201).send({ message: "Login admin successful" });
//         // }
//         // res.status(200).send({ message: "Login user successful" });
//     }catch (error){
//         console.log(error)
//         return error
//     }
//   }
// }

// export default new UserDao();
