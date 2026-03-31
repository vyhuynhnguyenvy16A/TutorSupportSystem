import authController from "../controllers/auth.controller.js";
import express from "express";

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);

export default authRouter;