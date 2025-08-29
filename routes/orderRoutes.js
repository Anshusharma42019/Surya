import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderInvoice,
  deleteInvoice
} from "../controllers/orderController.js";


const router = express.Router();

// Order CRUD
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Invoice
router.get("/:id/invoice", getOrderInvoice);
router.delete("/:id/invoice", deleteInvoice);

export default router;
