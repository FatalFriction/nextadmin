"use server";

import { revalidatePath } from "next/cache";
import { Product, User, Transaction } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";
import { z } from "zod";

// Validation Schemas
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().optional(),
  address: z.string().optional(),
  isAdmin: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  desc: z.string().min(5, "Description must be at least 5 characters long"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  color: z.string().optional(),
  size: z.string().optional(),
});

const transactionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  paymentmethod: z.string().min(3, "Payment method is required"),
  amount: z.number().positive("Amount must be a positive number"),
  status: z.string().min(3, "Status is required"),
});

async function handleDatabaseOperation(operation, errorMessage) {
  try {
    await connectToDB();
    return await operation();
  } catch (err) {
    console.error(`${errorMessage}:`, err);

    if (err instanceof z.ZodError) {
      throw new Error(err.errors.map((e) => e.message).join(", "));
    } else if (err.code === 11000) {
      throw new Error(`Duplicate entry: ${Object.keys(err.keyValue).join(", ")} already exists.`);
    } else {
      throw new Error(err.message || errorMessage);
    }
  }
}

export const addUser = async (formData) => {
  return handleDatabaseOperation(async () => {
    const userData = Object.fromEntries(formData);
    userData.isAdmin = userData.isAdmin === "true";
    userData.isActive = userData.isActive === "true";

    userSchema.parse(userData);
    userData.password = await bcrypt.hash(userData.password, 10);

    await new User(userData).save();
    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
  }, "Failed to create user!");
};

export const updateUser = async (formData) => {
  return handleDatabaseOperation(async () => {
    const { id, ...updateData } = Object.fromEntries(formData);
    if (updateData.isAdmin) updateData.isAdmin = updateData.isAdmin === "true";
    if (updateData.isActive) updateData.isActive = updateData.isActive === "true";
    
    userSchema.partial().parse(updateData);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await User.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
  }, "Failed to update user!");
};

export const addProduct = async (formData) => {
  return handleDatabaseOperation(async () => {
    const productData = Object.fromEntries(formData);
    productSchema.parse(productData);

    await new Product(productData).save();
    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
  }, "Failed to create product!");
};

export const updateProduct = async (formData) => {
  return handleDatabaseOperation(async () => {
    const { id, ...updateData } = Object.fromEntries(formData);
    productSchema.partial().parse(updateData);

    await Product.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
  }, "Failed to update product!");
};

export const deleteUser = async (formData) => {
  return handleDatabaseOperation(async () => {
    const { id } = Object.fromEntries(formData);
    await User.findByIdAndDelete(id);
    revalidatePath("/dashboard/users");
  }, "Failed to delete user!");
};

export const deleteProduct = async (formData) => {
  return handleDatabaseOperation(async () => {
    const { id } = Object.fromEntries(formData);
    await Product.findByIdAndDelete(id);
    revalidatePath("/dashboard/products");
  }, "Failed to delete product!");
};

export const authenticate = async (prevState, formData) => {
  try {
    const { username, password } = Object.fromEntries(formData);
    if (!username || !password) return "Username and password are required";

    await signIn("credentials", { username, password });
  } catch (err) {
    return err.message.includes("CredentialsSignin") ? "Wrong Credentials" : err.message;
  }
};

export const addTransaction = async (formData) => {
  return await handleDatabaseOperation(async () => {
    const transactionData = Object.fromEntries(formData);
    
    if (transactionData.amount) {
      transactionData.amount = parseFloat(transactionData.amount);
    }

    try {
      transactionSchema.parse(transactionData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { error: err.errors.map((e) => e.message).join(", ") };
      }
    }

    await new Transaction(transactionData).save();
    revalidatePath("/dashboard/transactions");

    return { success: true };
  }, "Failed to create transaction!");
};

export const updateTransaction = async (formData) => {
  return handleDatabaseOperation(async () => {
    const { id, ...updateData } = Object.fromEntries(formData);
    transactionSchema.partial().parse(updateData);

    await Transaction.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/transactions");
  }, "Failed to update transaction!");
};

export const deleteTransaction = async (formData) => {
  return handleDatabaseOperation(async () => {
    const { id } = Object.fromEntries(formData);
    await Transaction.findByIdAndDelete(id);
    revalidatePath("/dashboard/transactions");
  }, "Failed to delete transaction!");
};
