import express from 'express';
import { isAuth, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../Controller/authController.js';
import UserAuth from '../middleware/userAuth.js';

const authRouter = express.Router();
authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/send-verify-otp",UserAuth,sendVerifyOtp)
authRouter.post("/verify-account",UserAuth,verifyEmail);
authRouter.post("/is-auth",UserAuth,isAuth);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;

