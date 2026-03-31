import express from "express";
import authRouter from "./auth.router.js";
import studentRouter from "./student.router.js";
import tutorRouter from "./tutor.router.js";
import publicRouter from "./public.router.js";
import adminRouter from "./admin.router.js";

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/student', studentRouter);
rootRouter.use('/tutor', tutorRouter);
rootRouter.use('/public', publicRouter);
rootRouter.use('/admin', adminRouter);

export default rootRouter;