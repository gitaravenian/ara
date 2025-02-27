import express from "express";
import { getAllPhones } from "../controllers/phoneController.js";

const router = express.Router();

router.get("/", getAllPhones);

export default router;
