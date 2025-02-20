"use client";
import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Dashboard from "../components/Dashboard"; // ✅ Import Dashboard

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data); // 🔄 Update state
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log("Transactions Data:", transactions); // 🔍 Debugging
  }, [transactions]);

  // ✅ Add new transaction instantly without waiting for API response
  const addTransaction = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Personal Finance Tracker</h1>

      {/* ✅ Dashboard Section (Only One CategoryPieChart Inside Dashboard) */}
      <Dashboard transactions={transactions} />

      {/* Transaction Form */}
      <TransactionForm refreshTransactions={fetchTransactions} addTransaction={addTransaction} />

      {/* Transaction List */}
      <TransactionList transactions={transactions} refreshTransactions={fetchTransactions} />
    </div>
  );
}
