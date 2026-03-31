import express from "express";
import tutorController from "../controllers/tutor.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const tutorRouter = express.Router();

tutorRouter.get('/profile', verifyToken, tutorController.getProfile)
tutorRouter.put('/profile', verifyToken, tutorController.updateProfile)
tutorRouter.get('/bookings', verifyToken, tutorController.getBookings)
tutorRouter.post('/register', tutorController.register)
tutorRouter.delete('/slots/:id',verifyToken,tutorController.deletebooking)
tutorRouter.post('/slots', verifyToken, tutorController.makeSlots)
tutorRouter.post('/fields', verifyToken, tutorController.registerFields)

tutorRouter.get('/me/slots', verifyToken, tutorController.getMySlots)
export default tutorRouter;