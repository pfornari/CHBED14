import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String },
  rol: 
  //acá poner un array?
    {
      type: String,
      default: "user",
      enum: ["user", "admin", "premium"],
    },


  cart: { _id: { type: Schema.Types.ObjectId, ref: "carts" } },

  loggedBy: { type: String, required: false },
});

const userModel = model("users", userSchema);
export { userModel };
