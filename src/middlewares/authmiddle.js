import { apierror } from "../utils/apierror";
import { asynchandler } from "../utils/asynchandler";
 import { User } from '../models/users.models.js';
import { jwt } from "jsonwebtoken";
export const verifyJwt=asynchandler(async(req,res,next)=>{
    const token=req.cookies?.accesstoken|| req.header(Authentication)?.replace("Bearer ","")
    if(!token){
        throw new apierror(401,"token is not present");

    }
    const decodejwt=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodejwt?._id).select("-password -refreshToken");
    req.user=token;
    next();
})