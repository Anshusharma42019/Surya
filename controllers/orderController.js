import Order from "../models/Order.js";
import { sendResponse } from "../utils/apiResponse.js";
import { generateInvoice } from "../utils/invoiceGenerator.js";

// CREATE
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return sendResponse(res, true, 201, "Order created successfully", order);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// READ ALL (use /api/paginate/Order for pagination)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ is_deleted: false }).sort("-createdAt");
    return sendResponse(res, true, 200, "Orders fetched successfully", orders);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// READ ONE
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, is_deleted: false });
    if (!order) return sendResponse(res, false, 404, "Order not found");
    return sendResponse(res, true, 200, "Order fetched successfully", order);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// UPDATE
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true }
    );
    if (!order) return sendResponse(res, false, 404, "Order not found");
    return sendResponse(res, true, 200, "Order updated successfully", order);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// SOFT DELETE
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      { is_deleted: true },
      { new: true }
    );
    if (!order) return sendResponse(res, false, 404, "Order not found");
    return sendResponse(res, true, 200, "Order deleted successfully");
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// INVOICE
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, is_deleted: false });
    if (!order) return sendResponse(res, false, 404, "Invoice not found or deleted");

    const invoice = generateInvoice(order);
    return sendResponse(res, true, 200, "Invoice generated successfully", invoice);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// SOFT DELETE INVOICE
export const deleteInvoice = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      { is_deleted: true },
      { new: true }
    );
    if (!order) return sendResponse(res, false, 404, "Invoice not found");

    return sendResponse(res, true, 200, "Invoice deleted successfully");
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// 📊 YEARLY REVENUE
export const getYearlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return sendResponse(res, false, 400, "Year is required");

    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);

    const revenue = await Order.aggregate([
      { $match: { is_deleted: false, createdAt: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    return sendResponse(res, true, 200, "Yearly revenue fetched successfully", revenue[0] || { totalRevenue: 0 });
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// 📊 MONTHLY REVENUE
export const getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return sendResponse(res, false, 400, "Year is required");

    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);

    const revenue = await Order.aggregate([
      { $match: { is_deleted: false, createdAt: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: { month: { $month: "$createdAt" } }, monthlyRevenue: { $sum: "$totalAmount" } } },
      { $sort: { "_id.month": 1 } },
    ]);

    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const formatted = months.map((m, idx) => {
      const found = revenue.find(r => r._id.month === idx + 1);
      return { month: m, revenue: found ? found.monthlyRevenue : 0 };
    });

    return sendResponse(res, true, 200, "Monthly revenue fetched successfully", formatted);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};
