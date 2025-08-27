
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import widgetRouter from "./routes/widgetRoutes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://surya-two.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

app.use("/api/items", itemRouter);
app.use("/api/orders", orderRouter);   
app.use("/api/widgets", widgetRouter);

// Remove app.listen for Vercel deployment
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// Export the app for Vercel serverless function
export default app;