import React, { useState, useEffect } from "react";
import type { Expense } from "./ExpenseList";


export type ExpenseFormData = Omit<Expense, "_id" | "createdAt" | "userId">;

type Props = {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  expenseToEdit?: Expense | null;
};

export default function AddExpenseForm({ onSubmit, onCancel, expenseToEdit }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!expenseToEdit;

  useEffect(() => {
    if (isEditMode) {
      setTitle(expenseToEdit.title);
      setAmount(String(expenseToEdit.amount));
      setCategory(expenseToEdit.category);
      setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
    }
  }, [expenseToEdit, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit({
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
    });
  };
  
  const validate = () => {
    if (!title || title.trim().length < 3) return "Title must be at least 3 characters.";
    const parsed = Number(amount);
    if (Number.isNaN(parsed) || parsed <= 0) return "Amount must be a number greater than 0.";
    if (!date || Number.isNaN(new Date(date).getTime())) return "Date is invalid.";
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        {isEditMode ? "Edit Expense" : "Add New Expense"}
      </h3>
      {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="e.g., Lunch at Subway"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Others</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-200"
        >
          {isEditMode ? "Update Expense" : "Save Expense"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent border border-gray-700 text-gray-300 px-3 py-2 rounded-md hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}