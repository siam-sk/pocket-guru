import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import logo from "./assets/logo.png";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import type { Expense } from "./components/ExpenseList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Others"];

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "All") {
        params.append("category", categoryFilter);
      }
      if (dateRange.start) {
        params.append("startDate", dateRange.start);
      }
      if (dateRange.end) {
        params.append("endDate", dateRange.end);
      }

      const response = await axios.get(`${API_URL}/expenses`, { params });
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, dateRange]);

  // Re-fetch when filters change
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFormSuccess = () => {
    fetchExpenses();
    setIsFormVisible(false);
    setEditingExpense(null);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingExpense(null);
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setIsFormVisible(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        console.error(err);
        setError("Failed to delete expense.");
      }
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans text-gray-300 flex flex-col">
      <header className="bg-[#171717] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Pocket Guru Logo" className="h-10 w-10" />
            <div className="pb-1">
              <div className="text-xl font-bold text-white">Pocket Guru</div>
              <div className="text-xs text-gray-400 -mt-0.5">Your personal expense tracker</div>
            </div>
          </div>
          <button
            onClick={isFormVisible ? handleCancelForm : handleAddClick}
            className="bg-white text-black px-3 py-2 rounded-md font-semibold hover:bg-gray-200"
          >
            {isFormVisible ? "Cancel" : "Add Expense"}
          </button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {isFormVisible && (
          <AddExpenseForm
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
            expenseToEdit={editingExpense}
          />
        )}

        {/* Filter Controls */}
        <div className="my-6 p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>
        </div>

        <ExpenseList
          expenses={expenses}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <footer className="bg-[#171717] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-sm text-gray-500">&copy; 2025 Pocket Guru. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
