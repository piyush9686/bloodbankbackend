import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
export const app= express();
dotenv.config({
  path: "./.env"
});
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:'16kb'}));   //form bhara to data liya

//url se data lena ho to
app.use(express.urlencoded({extended:true,limit:'16kb'}));

app.use(express.static('public'));  //static files folder like images css js

//server se cookie read krne k liye and access krne k liye
app.use(cookieParser()); 

import authRoutes from './src/routes/donor.routes.js';
app.use('/api', authRoutes);
import requestRoutes from './src/routes/request.routes.js';
app.use('/api', requestRoutes);