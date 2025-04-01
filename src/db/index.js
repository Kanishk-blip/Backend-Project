import mongoose from "mongoose";
import {db_name} from "../constant.js";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();

const app=express();
const connectdb=async ()=>{
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log(`${connectionInstance.connection.host}`)
        // app.on(error,(error)=>{
        //     console.log("ERROR:",error);
        //     throw error;
        // })
        // app.listen(process.env.Port,()=>{
        //     console.log("app is listening");
        // })
    } catch (error) {
        console.log("ERROR:",error);
       // throw error;\
       process.exit(1);
    }
}
export default connectdb;