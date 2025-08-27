import express from "express";
import { getWidgets } from "../controllers/widgetController.js";

const router = express.Router();

router.get("/", getWidgets);

export default router;
