import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function PUT(req, { params }) {
  await connectToDatabase();

  try {
    const { id } = params; // No need to await params.id
    const { description, amount, category } = await req.json();

    if (!id || !description || !amount || !category) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { description, amount, category },
      { new: true }
    );

    if (!updatedTransaction) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedTransaction), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
