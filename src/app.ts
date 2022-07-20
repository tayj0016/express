import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from "dotenv";
import mysql from "mysql2";

import { userRoute } from './routes/user.route';

const app = express(); 

// CORS 
app.use(cors({credentials: true, origin: true}));
// app.options('*', cors({credentials: true, origin: true}));
app.use(cors({
    credentials: true,
    origin: '*'
}));

// DATABASE
// dotenv.config();

// export const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME
// });

app.use(express.json()); //New Body Parser
app.use(express.urlencoded({extended:false})); // Also parse HTML Forms
app.use(cookieParser()); //Cookie parser

app.use('/users', userRoute);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(3000);