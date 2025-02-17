import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../lib/model.js";
import bcrypt from "bcrypt";

const MONGO_URI = process.env.MONGO;

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectToDB();

  const adminExists = await User.findOne({ email: "admin@example.com" });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
      isActive: true,
    });

    console.log("✅ Admin user created");
  }
};

seedDatabase();
