import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res, next) => {
  // console.log("Request Headers:", req.headers);
  try {
    const authHeader = req.header("Authorization");
    console.log(`authHeader: ${authHeader}`);

    if (!authHeader) {
      console.log("!authHeader");
      return res.status(403).json({ error: "Authorization error" });
    }

    const token = authHeader.split(" ")[1]; // Get the actual token

    if (!token) {
      return res.status(403).json({ error: "Authorization error" });
    }

    console.log(`token: ${token}`);

    const payload = jwt.verify(token, `${process.env.jwtSecret}`);

    req.user = payload.id;
    console.log(`authorization.js req.user: ${req.user}`);
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).send("Authorization error");
  }
};
