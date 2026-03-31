import verifyToken from "../middleware/auth.middleware.js";
import adminController from "../controllers/admin.controller.js";
import express from "express";

const adminRouter = express.Router()
adminRouter.get('/reports/evaluation', verifyToken, adminController.getEvals)
adminRouter.post('/register', adminController.register)
adminRouter.put('/pairings/:GHEPCAPID', verifyToken, adminController.editPairing)

adminRouter.get('/pairings', verifyToken, adminController.getPairings)

adminRouter.post('/pairings/:GHEPCAPID/approve', verifyToken, adminController.approvePairing)
adminRouter.post('/pairings/:GHEPCAPID/reject', verifyToken, adminController.rejectPairing)

adminRouter.post('/pairings/run-ai', verifyToken, adminController.runAIPairing)
adminRouter.put('/tutors/:tutorId/fields', verifyToken, adminController.updateTutorFields)
adminRouter.get('/forms/:batch_id', verifyToken, adminController.getApplyingForm)

export default adminRouter;

