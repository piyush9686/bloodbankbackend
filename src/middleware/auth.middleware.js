import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";

export const verifyJWT = async (req, res, next) => {

    const token = req.headers.authorization?.replace("Bearer ", "");

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Admin.findById(decodedToken._id);

    req.user = user;   // 🔥 VERY IMPORTANT

    next();
}