import Widget from "../models/Widget.js";
import Order from "../models/Order.js";

// Get widget stats
export const getWidgets = async (req, res) => {
  try {
    // monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // yearly revenue
    const yearlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);

    const widgets = await Widget.find();

    res.json({
      widgets,
      monthlyRevenue,
      yearlyRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
