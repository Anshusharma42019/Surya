// routes/paginationRoutes.js
import express from "express";
import { getPaginatedData } from "../controllers/paginationController.js";

const router = express.Router();

// Universal pagination endpoint
// GET /api/paginate/:collection?page=1&limit=25&sort=-createdAt&filters...
router.get("/:collection", getPaginatedData);

export default router;