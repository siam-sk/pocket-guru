import { useState, useEffect, useCallback, useRef } from "react";
import AddExpenseForm from "../components/AddExpenseForm";
import type { ExpenseFormData } from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import type { Expense } from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import api from "../lib/api";
import Skeleton from "../components/Skeleton";

const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Others"];

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);
      const response = await api.get("/expenses", { params });
      setExpenses(response.data);
    } catch {
      setError("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, dateRange]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleOpenModal = (expense?: Expense) => {
    setEditingExpense(expense || null);
    dialogRef.current?.showModal();
  };

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setEditingExpense(null);
  };

  const handleFormSubmit = async (data: ExpenseFormData) => {
    try {
      if (editingExpense) {
        // This is an update
        await api.patch(`/expenses/${editingExpense._id}`, data);
      } else {
        // This is a new expense
        await api.post("/expenses", data);
      }
      fetchExpenses();
      handleCloseModal();
      
    } catch (err) {
      
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch {
        setError("Failed to delete expense.");
      }
    }
  };

  const clearFilters = () => {
    setCategoryFilter("All");
    setDateRange({ start: "", end: "" });
  };

  // Check if there are no expenses and not loading
  const isEmpty = !loading && !error && expenses.length === 0;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => handleOpenModal()} className="bg-white text-black px-3 py-2 rounded-md font-semibold hover:bg-gray-200">
          Add Expense
        </button>
      </div>

      {/* Modal Dialog */}
      <dialog ref={dialogRef} className="m-auto bg-transparent p-0 border-none backdrop:bg-black/60">
        <AddExpenseForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          expenseToEdit={editingExpense}
        />
      </dialog>

      {loading ? (
        <>
          <Skeleton className="h-6 w-64 mb-3" />
          <Skeleton className="h-[340px] w-full mb-6" />
          <Skeleton className="h-24 w-full" />
        </>
      ) : isEmpty ? (
        <div className="text-center my-16">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Pocket Guru!</h2>
          <p className="text-gray-400 mb-6">Track your first expense to see your dashboard come to life.</p>
          <button onClick={() => handleOpenModal()} className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200">
            Add Your First Expense
          </button>
        </div>
      ) : (
        <>
          <ExpenseChart expenses={expenses} />
          {/* Filter Controls */}
          <div className="my-6 p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
              </div>
              <div className="flex-1 w-full">
                  <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                  <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2" />
              </div>
              <div className="flex-1 w-full">
                  <label className="block text-xs text-gray-400 mb-1">End Date</label>
                  <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2" />
              </div>
              <div className="flex-1 w-full">
                <button onClick={clearFilters} className="w-full bg-gray-700 text-gray-200 font-semibold py-2 px-3 rounded-md hover:bg-gray-600">
                  Clear
                </button>
              </div>
          </div>
          <ExpenseList expenses={expenses} loading={loading} error={error} onEdit={handleOpenModal} onDelete={handleDelete} />
        </>
      )}
    </>
  );
}