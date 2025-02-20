"use client";

import styles from "./linechart.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/app/lib/utils"; 

const RevenueChart = ({revenueData}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={revenueData} margin={{ top: 20, right: 10, left: 68, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => revenueData?.length ? formatCurrency(value) : value} />
          <Tooltip formatter={(value) => revenueData?.length ? formatCurrency(value) : value} contentStyle={{ background: "#1e293b", border: "none", color: "#fff" }} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
