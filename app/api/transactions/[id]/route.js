import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function PUT(req, { params }) {
  await connectToDatabase();

  try {
    const { id } = params; // No need to await params.id
    const { description, amount, category } = await req.json();

    if (!id || !description || amount === undefined || amount === null || !category) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return new Response(JSON.stringify({ error: "Amount must be a positive number" }), { status: 400 });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { description, amount, category },
      { new: true }
    );

    return new Response(JSON.stringify(updatedTransaction), { status: 200 });
  } catch (error) {
    console.error("PUT request error:", error);
    return new Response(JSON.stringify({ error: "Error updating transaction" }), { status: 500 });
  }
}