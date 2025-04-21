import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function jwtGenerator(id) { 
    const payload = {
        user: id
    }

    return jwt.sign(payload, `${process.env.jwtSecret}`, {expiresIn: "1hr"});
}

export default jwtGenerator;