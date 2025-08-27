import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import widgetRouter from "./routes/widgetRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/items", itemRouter);
app.use("/api/orders", orderRouter);   
app.use("/api/widgets", widgetRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
