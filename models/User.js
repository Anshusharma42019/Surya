import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    enum: [1, 2], // 1:admin, 2:staff
  },
  category: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1:medical, 2:optical, 3:common
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;