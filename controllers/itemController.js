import Item from "../models/Item.js";
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

// Get Items with Pagination, Filter, Sort
export const getItems = async (req, res) => {
  try {
    const { skip = 0, limit = 10, sort = '{"createdAt": -1}', filter = "{}" } = req.query;
    const parsedFilter = JSON.parse(filter);
    const parsedSort = JSON.parse(sort);

    // Add soft delete filter
    parsedFilter.is_deleted = false;

    const total = await Item.countDocuments(parsedFilter);
    const items = await Item.find(parsedFilter)
      .sort(parsedSort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const meta = { skip: +skip, limit: +limit, count: items.length, total, filter: parsedFilter, sort: parsedSort };

    sendResponse(res, true, 200, null, items, meta);
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
  const unitTypes = Item.schema.path("unitType").enumValues;
  res.json(unitTypes);
};
