// controllers/paginationController.js
import mongoose from "mongoose";
import { sendResponse } from "../utils/apiResponse.js";
import { createPagination, getPaginationParams } from "../utils/pagination.js";

// Universal pagination API
export const getPaginatedData = async (req, res) => {
  try {
    const { collection } = req.params;
    const { skip, limit, sort, filters } = getPaginationParams(req.query);
    
    // Get the model
    const Model = mongoose.models[collection];
    if (!Model) {
      return sendResponse(res, false, 404, `Collection '${collection}' not found`);
    }

    // Build base filter
    let filter = {};
    
    // Add soft delete filter if model has is_deleted field
    const schema = Model.schema.paths;
    if (schema.is_deleted) {
      filter.is_deleted = false;
    }

    // Apply dynamic filters
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      if (value && value !== '' && value !== undefined && value !== null) {
        // Handle different filter types
        if (key.startsWith('min') && key.length > 3) {
          const field = key.substring(3).toLowerCase();
          if (!filter[field]) filter[field] = {};
          filter[field].$gte = Number(value);
        } else if (key.startsWith('max') && key.length > 3) {
          const field = key.substring(3).toLowerCase();
          if (!filter[field]) filter[field] = {};
          filter[field].$lte = Number(value);
        } else if (schema[key] && schema[key].instance === 'String') {
          // Text search for string fields
          filter[key] = new RegExp(value, "i");
        } else if (schema[key] && schema[key].instance === 'Number') {
          // Exact match for numbers
          filter[key] = Number(value);
        } else if (schema[key] && schema[key].instance === 'Boolean') {
          // Boolean conversion
          filter[key] = value === 'true';
        } else {
          // Default exact match
          filter[key] = value;
        }
      }
    });

    const result = await createPagination(Model, {
      filter,
      skip,
      limit,
      sort
    });

    return sendResponse(res, true, 200, `${collection} data fetched successfully`, result.data, result.meta);
  } catch (err) {
    return sendResponse(res, false, 500, err.message);
  }
};