import Order from "../models/Order.js";
import { sendResponse } from "../utils/apiResponse.js";

// CREATE
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return sendResponse(res, true, 201, "Order created successfully", order);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};

// READ ALL with pagination, filter, sort
export const getOrders = async (req, res) => {
  try {
    const { skip = 0, limit = 10, sort = "-createdAt", customerName } = req.query;
    let filter = { is_deleted: false };
    if (customerName) filter.customerName = new RegExp(customerName, "i");

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sort);

    const meta = { skip: Number(skip), limit: Number(limit), total, count: orders.length, sort, filter };
    return sendResponse(res, true, 200, "Orders fetched successfully", orders, meta);
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
