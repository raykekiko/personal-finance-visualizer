"use client";
import { useState } from "react";

export default function TransactionList({ transactions = [], refreshTransactions }) {
  const [editTransaction, setEditTransaction] = useState(null);
  const [editedData, setEditedData] = useState({ description: "", amount: "", category: "" });

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        refreshTransactions();
      } else {
        alert("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setEditedData(transaction);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value !== "" && Number(value) < 0) return; // block negatives
    setEditedData({ ...editedData, amount: value });
  };

  const handleSave = async () => {
    if (!editedData.description || !editedData.amount || !editedData.category) {
      alert("Please fill all fields.");
      return;
    }

    if (Number(editedData.amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${editTransaction._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editedData.description,
          amount: Number(editedData.amount),
          category: editedData.category.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      await response.json();
      setEditTransaction(null);
      refreshTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction.");
    }
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const recentTransactions = safeTransactions.slice(-5).reverse();

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Transaction History</h2>

      <h3 className="text-lg font-semibold mt-6">Recent Transactions</h3>
      <ul className="list-disc list-inside bg-white p-4 rounded-lg shadow">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((txn) => (
            <li key={txn._id} className="border-b p-2">
              {txn.description} - ₹{txn.amount} ({txn.category || "No Category"})
            </li>
          ))
        ) : (
          <p className="text-gray-500">No recent transactions available.</p>
        )}
      </ul>

      {safeTransactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          {safeTransactions.map((transaction) => (
            <div key={transaction._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold text-gray-800">{transaction.description}</p>
                <span className="text-gray-500">{transaction.category || "No Category"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600 mr-4">₹{transaction.amount}</span>
                <button
                  onClick={() => handleEdit(transaction)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg mx-1"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No transactions yet.</p>
      )}

      {editTransaction && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Edit Transaction</h2>
            <input
              type="text"
              value={editedData.description}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
            />
            <input
              type="number"
              min="0"
              value={editedData.amount}
              onChange={handleAmountChange}
              className="w-full p-2 border rounded mb-2"
              placeholder="Amount"
            />
            <input
              type="text"
              value={editedData.category || ""}
              onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Category"
              required
            />

            <div className="flex justify-between">
              <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded w-1/2 mr-2">
                Save
              </button>
              <button onClick={() => setEditTransaction(null)} className="bg-gray-500 text-white p-2 rounded w-1/2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}