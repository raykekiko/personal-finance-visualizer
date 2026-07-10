import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Ensure the path is correct
import Transaction from "@/models/Transaction";
import { ObjectId } from "mongodb";

// ✅ Handle GET request (Fetch all transactions)
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("GET request error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// ✅ Handle POST request (Add a new transaction)
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    console.log("Received data:", data); // Debugging

    const { description, amount, category } = data;

    // 🛑 Validate input data
    if (!description || amount === undefined || amount === null || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    // ✅ Ensure `date` is always included
    const newTransaction = new Transaction({
      description,
      amount,
      category,
      date: new Date(),
    });

    await newTransaction.save();

    return NextResponse.json({ message: "Transaction added" }, { status: 201 });

  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}

// ✅ Handle DELETE request (Remove a transaction)
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });

  } catch (error) {
    console.error("DELETE request error:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}

// ✅ Handle PUT request (Update a transaction)
export async function PUT(req) {
  try {
    await connectDB();
    const { id, description, amount, category } = await req.json();

    if (!id || !description || amount === undefined || amount === null || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    await Transaction.updateOne(
      { _id: new ObjectId(id) },
      { $set: { description, amount, category } }
    );

    return NextResponse.json({ message: "Transaction updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("PUT request error:", error);
    return NextResponse.json({ error: "Error updating transaction" }, { status: 500 });
  }
}