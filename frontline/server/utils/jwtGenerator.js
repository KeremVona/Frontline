import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function jwtGenerator(id) {
  const payload = { id }; // or { id: id } id 2

  /*const payload = {
    user: id, // This should match the `id` in the user table
  };*/

  console.log(`user:id ${payload.id}`);

  console.log(`process.env ${process.env.jwtSecret}`);

  return jwt.sign(payload, `${process.env.jwtSecret}`, { expiresIn: "1h" });
}

export default jwtGenerator;
