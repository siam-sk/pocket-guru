import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Expense } from "./ExpenseList";
import { CATEGORY_COLORS, DEFAULT_COLOR } from "../lib/constants";

type Props = {
  expenses: Expense[];
};

// Custom label renderer to show percentage inside the pie slice
type CustomizedLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
  const RADIAN = Math.PI / 180;
  const cX = cx ?? 0;
  const cY = cy ?? 0;
  const mAngle = midAngle ?? 0;
  const iRadius = innerRadius ?? 0;
  const oRadius = outerRadius ?? 0;
  const p = percent ?? 0;

  const radius = iRadius + (oRadius - iRadius) * 0.5;
  const x = cX + radius * Math.cos(-mAngle * RADIAN);
  const y = cY + radius * Math.sin(-mAngle * RADIAN);

  // Don't render label for very small slices
  if (p < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
      {`${(p * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ExpenseChart({ expenses }: Props) {
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || "Others";
      const amount = Number(expense.amount) || 0;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [expenses]);

  if (chartData.length === 0) {
    return (
      <div className="my-6 p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg flex justify-center items-center h-64">
        <p className="text-gray-500">No data available for the chart.</p>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg" style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLOR} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "#171717",
              borderColor: "#374151",
            }}
            labelStyle={{ color: "#d1d5db" }}
            itemStyle={{ color: "#d1d5db" }} 
          />
          <Legend
            formatter={(value, entry) => {
              
              const { color } = entry;
              return <span style={{ color }}>{value}</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}