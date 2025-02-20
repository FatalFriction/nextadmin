import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
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
    img: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    img: {
      type: String,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  { timestamps: true }
);

const TransactionSchema = new mongoose.Schema(
  {
    transactionid: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    paymentmethod: {
      type: String,
      required: true,
      enum: ["credit_card", "paypal", "qris", "bank_transfer"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "success", "failed"],
    },
  },
  { timestamps: true }
);

const RevenueSchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      required: true,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    month: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
export const Revenue = mongoose.models.Revenue || mongoose.model("Revenue", RevenueSchema);
