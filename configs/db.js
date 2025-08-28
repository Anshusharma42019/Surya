import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("DB connected"));
  let uri = process.env.MONGODB_URI;
  if (!uri.endsWith("/")) uri += "/";
  uri += "SuryaMeds";
  await mongoose.connect(uri);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
