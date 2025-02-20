import { Product, User, Transaction,Revenue } from "./models";
import { connectToDB } from "./utils";

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 8;

  try {
    connectToDB();
    const count = await User.find({ username: { $regex: regex } }).countDocuments();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUser = async (id) => {
  console.log(id);
  try {
    connectToDB();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const fetchProducts = async (q, page) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 8;

  try {
    connectToDB();
    const count = await Product.find({ title: { $regex: regex } }).countDocuments();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, products };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch products!");
  }
};

export const fetchProduct = async (id) => {
  try {
    connectToDB();
    const product = await Product.findById(id);
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch product!");
  }
};

export const fetchTransactions = async (q, page) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 8;

  try {
    connectToDB();
    const count = await Transaction.find({ name: { $regex: regex } }).countDocuments();
    const transactions = await Transaction.find({ name: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));

    return { count, transactions };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch transactions!");
  }
};

export const fetchTransaction = async (id) => {
  try {
    connectToDB();
    const transaction = await Transaction.findById(id);
    return transaction;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch transaction!");
  }
};

export const fetchRevenue = async () => {
  try {
    // Aggregate revenue from successful transactions
    const revenueData = await Transaction.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    if (!revenueData.length) {
      return { 
        totalRevenue: 0, 
        totalTransactions: 0, 
        averageTransactionValue: 0, 
        revenueGrowth: 0, 
        monthlyRevenue: [],  
        categoryRevenue: []
      };
    }

    const { totalRevenue, totalTransactions } = revenueData[0];
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Find the most recent revenue record
    const latestRevenue = await Revenue.findOne().sort({ createdAt: -1 });

    // Get previous month's revenue for comparison
    const previousRevenue = await Revenue.findOne()
      .sort({ createdAt: -1 })
      .skip(1); // Skip latest record to get the previous one

    const revenueGrowth =
      previousRevenue && previousRevenue.totalRevenue > 0
        ? ((totalRevenue - previousRevenue.totalRevenue) / previousRevenue.totalRevenue) * 100
        : 0;

    // ✅ Store data without explicitly setting "month"
    await Revenue.findOneAndUpdate(
      { _id: latestRevenue?._id }, // If no record exists, create a new one
      { 
        $set: { 
          totalRevenue, 
          totalTransactions, 
          lastUpdated: new Date() 
        } 
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Fetch monthly revenue dynamically from createdAt
    const monthlyRevenue = await Revenue.aggregate([
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Extract month from createdAt
          totalRevenue: 1,
        },
      },
      { $sort: { month: 1 } },
    ]) || [];

    // Get revenue by category
    const categoryRevenue = await Transaction.aggregate([
      { $match: { status: "success" } }, // Only count successful transactions
      {
        $group: {
          _id: "$paymentmethod", // Group by payment method
          totalCount: { $sum: 1 }, // Count transactions
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          totalCount: 1, // Rename for clarity
        },
      },
    ]);    

    const normalizedCategoryRevenue = categoryRevenue.map((entry) => ({
      name: entry.paymentMethod
        ? entry.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        : "Unknown",
      value: entry.totalCount || 0, 
    }));

    return { 
      totalRevenue, 
      totalTransactions, 
      averageTransactionValue, 
      revenueGrowth, 
      monthlyRevenue, 
      categoryRevenue: normalizedCategoryRevenue 
    };
  } catch (err) {
    console.error("Error fetching revenue:", err);
    throw new Error("Failed to fetch revenue data!");
  }
};

// DUMMY DATA
export const cards = [
  {
    id: 1,
    title: "Total Pengguna",
    number: 10.928,
    change: 12,
  },
  {
    id: 2,
    title: "Stok QRIS",
    number: 8.236,
    change: -2,
  },
  {
    id: 3,
    title: "Saldo",
    number: 6.642,
    change: 18,
  },
];
