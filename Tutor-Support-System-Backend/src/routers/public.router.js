import publicController from "../controllers/public.controller.js";
import express from "express"

const publicRouter = express.Router();

publicRouter.get('/fields', publicController.getFields)
publicRouter.get('/pairing-batches', publicController.getPairingBatches)

export default publicRouter;