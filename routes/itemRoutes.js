import express from "express";
import { createItem, getItems, getItem, updateItem, deleteItem, getUnitTypes } from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem); 
router.get("/", getItems);
router.get("/:id", getItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get("/unit-types", getUnitTypes);


export default router;

