import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const CategoryPieChart = ({ transactions = [] }) => {
  console.log("Received Transactions in CategoryPieChart:", transactions);

  if (!transactions || transactions.length === 0) {
    return <p className="text-gray-500">No transactions available.</p>;
  }

  // 🛠️ Process transactions safely inside the function
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (!transaction.category) return acc; // Ignore transactions without category

    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {});

  const data = Object.keys(categoryTotals).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CategoryPieChart;
