"use client";

import styles from "./piechart.module.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const RevenueByCategoryChart = ({ categoryData }) => {
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Revenue by Category</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie 
            data={categoryData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={80}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByCategoryChart;
