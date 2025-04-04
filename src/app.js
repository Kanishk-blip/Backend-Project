import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express();
app.use(cors({
    origin: '*',
    credentials: true
}))
export {app};