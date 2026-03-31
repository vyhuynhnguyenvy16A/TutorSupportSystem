import studentController from "../controllers/student.controller.js";
import express from "express";
import verifyToken from "../middleware/auth.middleware.js";

const studentRouter = express.Router();

studentRouter.get('/profile', verifyToken, studentController.getProfile)
studentRouter.put('/profile', verifyToken, studentController.updateProfile)
studentRouter.get('/calendar', verifyToken, studentController.getCalendar)
studentRouter.get('/bookings', verifyToken, studentController.getBookings)
studentRouter.post('/applications', verifyToken, studentController.createApplication)

export default studentRouter;