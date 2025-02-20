import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = ({ transactions }) => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (!transactions) return;

    // Calculate total expenses
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    setTotalExpenses(total);

    // Group by category
    const categoryMap = {};
    transactions.forEach((tx) => {
      const category = tx.category || "Uncategorized";
      categoryMap[category] = (categoryMap[category] || 0) + tx.amount;
    });

    // Convert to array for PieChart
    const chartData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(chartData);
  }, [transactions]);

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CD1"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Total Expenses Card */}
      <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
        <p className="text-2xl font-bold text-blue-600">₹{totalExpenses}</p>
      </div>

      {/* Category-wise Spending */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Category-wise Spending</h2>
        <div className="flex justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
