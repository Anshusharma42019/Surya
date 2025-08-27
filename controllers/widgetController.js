import Widget from "../models/Widget.js";

// Get widget stats
export const getWidgets = async (req, res) => {
  try {
    const widgets = await Widget.find();
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
