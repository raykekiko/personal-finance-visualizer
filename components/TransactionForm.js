"use client";

import { useState } from "react";

export default function TransactionForm({ refreshTransactions }) {
  const [formData, setFormData] = useState({
    description: "",  // Ensure controlled input
    amount: 0,        // Numeric field starts at 0
    category: ""      // Avoid undefined
  });

  // Generic handler for all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value, // Convert amount to number
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { description, amount, category } = formData;

    if (!description || !amount || !category) return;

    const newTransaction = { description, amount, category, date: new Date() };

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add transaction");
      }

      // Reset form after successful submission
      setFormData({ description: "", amount: 0, category: "" });

      refreshTransactions(); // ✅ Refresh the list instantly
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-lg bg-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Add Transaction</h2>

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg mb-4 focus:ring focus:ring-blue-300"
      >
        <option value="">Select a category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
      </select>

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition duration-300">
        ➕ Add Transaction
      </button>
    </form>
  );
}
