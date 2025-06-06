import mongoose from "mongoose";
import {db_name} from "./constant.js";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectdb from "./db/index.js";
import { app } from "./app.js";
connectdb().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
        console.log(` URL: http://localhost:${process.env.PORT || 8000}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})













































// const app=express();
// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
//         console.log(`${process.env.MONGODB_URI}/${db_name}`)
//         app.on('error',(error)=>{
//             console.log("ERROR:",error);
//             throw error;
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log("app is listening");
//         })
//     } catch (error) {
//         console.log("ERROR:",error);
//         throw error;
//     }
// })()


// import mongoose from "mongoose";
// import {db_name} from "./constant.js";
// import express from "express";
// import dotenv from 'dotenv';
// dotenv.config();

// const app=express();
// const connectdb=(async ()=>{
//     try {
//        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
//         console.log(`${connectionInstance.connection.host}`)
//         // app.on(error,(error)=>{
//         //     console.log("ERROR:",error);
//         //     throw error;
//         // })
//         // app.listen(process.env.Port,()=>{
//         //     console.log("app is listening");
//         // })
//     } catch (error) {
//         console.log("ERROR:",error);
//        // throw error;\
//        process.exit(1);
//     }
// })()
// export default connectdb;