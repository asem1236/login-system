import express from 'express';
import { getUserData } from '../Controller/userController.js';
import UserAuth from "../middleware/userAuth.js"

const userRouter = express.Router();

userRouter.get('/data', UserAuth, getUserData);

export default userRouter;