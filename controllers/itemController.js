import Item, { medicalUnitTypes, opticalUnitTypes } from "../models/Item.js";
import { sendResponse } from "../utils/apiResponse.js";
// Create Item
export const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    sendResponse(res, true, 201, "Item created successfully", item);
  } catch (err) {
    sendResponse(res, false, 500, err.message, []);
  }
};

// Get All Items (use /api/paginate/Item for pagination)
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ is_deleted: false });
    sendResponse(res, true, 200, "Items fetched successfully", items);
  } catch (err) {
    sendResponse(res, false, 500, err.message, []);
  }
};

// Get Single Item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, is_deleted: false });
    if (!item) return sendResponse(res, false, 404, "Item not found", []);
    sendResponse(res, true, 200, null, item);
  } catch (err) {
    sendResponse(res, false, 500, err.message, []);
  }
};

// Update Item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true }
    );
    if (!item) return sendResponse(res, false, 404, "Item not found", []);
    sendResponse(res, true, 200, "Item updated successfully", item);
  } catch (err) {
    sendResponse(res, false, 500, err.message, []);
  }
};

// Soft Delete Item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true });
    if (!item) return sendResponse(res, false, 404, "Item not found", []);
    sendResponse(res, true, 200, "Item deleted successfully", item);
  } catch (err) {
    sendResponse(res, false, 500, err.message, []);
  }
};

// In controllers/itemController.js
export const getUnitTypes = (req, res) => {
  sendResponse(res, true, 200, "Unit types fetched successfully", {
    medical: medicalUnitTypes,
    optical: opticalUnitTypes
  });
};
