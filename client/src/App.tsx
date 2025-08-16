import { useState, useEffect } from "react";
import axios from "axios";
import logo from "./assets/logo.png";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import type { Expense } from "./components/ExpenseList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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
