import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import ConnectDB from "./Config/mongodb.js";
import authRouter  from "./Routes/authRouter.js";
import userRouter from "./Routes/userRouter.js";

const app = express();
ConnectDB();

const port = process.env.PORT || 4000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Api end point 
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// listing the server 
app.listen(port, () => { console.log(`The Server Run on Port ${port}`); });
