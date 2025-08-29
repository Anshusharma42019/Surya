// utils/pagination.js
export const createPagination = async (Model, options = {}) => {
  const {
    filter = {},
    skip = 0,
    limit = 25,
    sort = "-createdAt",
    populate = null,
    select = null
  } = options;

  try {
    // Build query
    let query = Model.find(filter);
    
    if (populate) query = query.populate(populate);
    if (select) query = query.select(select);
    
    // Get total count
    const total = await Model.countDocuments(filter);
    
    // Apply pagination and sorting
    const data = await query
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sort);

    // Calculate pagination metadata
    const currentPage = Math.floor(Number(skip) / Number(limit)) + 1;
    const totalPages = Math.ceil(total / Number(limit));
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    return {
      data,
      meta: {
        total,
        count: data.length,
        currentPage,
        totalPages,
        hasNext,
        hasPrev,
        skip: Number(skip),
        limit: Number(limit),
        sort,
        filter
      }
    };
  } catch (error) {
    throw new Error(`Pagination error: ${error.message}`);
  }
};

export const getPaginationParams = (query) => {
  const {
    page = 1,
    limit = 25,
    sort = "-createdAt",
    ...filters
  } = query;

  const skip = (Number(page) - 1) * Number(limit);
  
  return {
    skip,
    limit: Number(limit),
    sort,
    filters
  };
};