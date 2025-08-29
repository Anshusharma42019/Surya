# Universal Pagination API

## Endpoint
```
GET /api/paginate/:collection
```

## Usage Examples

### Orders
```
GET /api/paginate/Order?page=1&limit=25&customerName=john&minTotalAmount=100&maxTotalAmount=1000
```

### Items
```
GET /api/paginate/Item?page=1&limit=25&name=tablet&category=1&minPrice=10&maxPrice=100
```



### Users
```
GET /api/paginate/User?page=1&limit=25&name=admin&role=1
```

## Query Parameters

### Standard Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 25)
- `sort` - Sort field (default: -createdAt)

### Dynamic Filters
- **Text Search**: Any string field (e.g., `name=search`, `customerName=john`)
- **Exact Match**: Any number/boolean field (e.g., `category=1`, `isActive=true`)
- **Range Filters**: Use `min` + `max` prefix (e.g., `minPrice=10`, `maxPrice=100`)

## Response Format
```json
{
  "success": true,
  "code": 200,
  "message": "Order data fetched successfully",
  "data": [...],
  "meta": {
    "total": 150,
    "count": 25,
    "currentPage": 1,
    "totalPages": 6,
    "hasNext": true,
    "hasPrev": false,
    "skip": 0,
    "limit": 25,
    "sort": "-createdAt",
    "filter": {...}
  }
}
```

## Add to server.js
```javascript
import paginationRoutes from "./routes/paginationRoutes.js";
app.use("/api/paginate", paginationRoutes);
```

## Features
- Works with any MongoDB collection
- Automatic soft delete filtering (if `is_deleted` field exists)
- Dynamic field type detection
- Text search for string fields
- Range filtering with min/max prefixes
- Consistent response format