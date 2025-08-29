// controllers/widget.controller.js
import Widget from "../models/Widget.js";
import Order from "../models/Order.js";

// Get widget stats
export const getWidgets = async (req, res) => {
  try {
    // Build monthly revenue from orders
    const monthlyRevenue = await Order.aggregate([
      // ignore soft-deleted orders if you use isDeleted
      {
        $match: {
          $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
        },
      },
      {
        $addFields: {
          // force createdAt to Date even if stored as string
          orderDate: { $toDate: "$createdAt" },
          // robust amount: prefer totalAmount/grandTotal/total; else sum items (qty * (rate || price))
          amount: {
            $let: {
              vars: {
                lineTotal: {
                  $reduce: {
                    input: { $ifNull: ["$items", []] },
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        {
                          $multiply: [
                            { $ifNull: ["$$this.quantity", 0] },
                            {
                              $ifNull: [
                                "$$this.rate",
                                { $ifNull: ["$$this.price", 0] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              in: {
                $ifNull: [
                  "$totalAmount",
                  {
                    $ifNull: [
                      "$grandTotal",
                      { $ifNull: ["$total", "$$lineTotal"] },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          totalRevenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: "$totalRevenue",
          orders: 1,
        },
      },
    ]);

    // Build yearly revenue from orders
    const yearlyRevenue = await Order.aggregate([
      {
        $match: {
          $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
        },
      },
      {
        $addFields: {
          orderDate: { $toDate: "$createdAt" },
          amount: {
            $let: {
              vars: {
                lineTotal: {
                  $reduce: {
                    input: { $ifNull: ["$items", []] },
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        {
                          $multiply: [
                            { $ifNull: ["$$this.quantity", 0] },
                            {
                              $ifNull: [
                                "$$this.rate",
                                { $ifNull: ["$$this.price", 0] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              in: {
                $ifNull: [
                  "$totalAmount",
                  {
                    $ifNull: [
                      "$grandTotal",
                      { $ifNull: ["$total", "$$lineTotal"] },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$orderDate" } },
          totalRevenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          totalRevenue: "$totalRevenue",
          orders: 1,
        },
      },
    ]);

    const widgets = await Widget.find();

    res.json({
      widgets,
      monthlyRevenue,
      yearlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
