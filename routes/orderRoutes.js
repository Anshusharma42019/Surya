import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderInvoice,
  deleteInvoice,
  getYearlyRevenue,
  getMonthlyRevenue
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Invoice
router.get("/:id/invoice", getOrderInvoice);
router.delete("/:id/invoice", deleteInvoice);

// Revenue stats
router.get("/stats/yearly", getYearlyRevenue);
router.get("/stats/monthly", getMonthlyRevenue);

export default router;
