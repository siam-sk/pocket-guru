export type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: "Food" | "Transport" | "Shopping" | "Others" | string;
  date: string;
};

type Props = {
  expenses: Expense[];
  loading?: boolean;
  error?: string | null;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
};

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const badgeClasses = (category: string) => {
  const c = category.toLowerCase();
  if (c === "food") return "bg-emerald-600/20 text-emerald-300 border border-emerald-600/40";
  if (c === "transport") return "bg-sky-600/20 text-sky-300 border border-sky-600/40";
  if (c === "shopping") return "bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-600/40";
  return "bg-gray-700/40 text-gray-300 border border-gray-600/50";
};

export default function ExpenseList({ expenses, loading, error, onDelete, onEdit }: Props) {
  const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Expenses</h2>
        <div className="text-sm sm:text-base text-gray-300">
          Total: <span className="font-bold text-white">{currency(total)}</span>
        </div>
      </div>

      {loading && (
        <div className="text-gray-400 text-sm">Loading expenses…</div>
      )}
      {!loading && error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
      {!loading && !error && expenses.length === 0 && (
        <div className="text-gray-400 text-sm">No expenses yet.</div>
      )}

      {/* Table for sm+ screens */}
      {expenses.length > 0 && (
        <>
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-800">
            <table className="min-w-full bg-[#0f0f0f]">
              <thead className="bg-[#121212] text-gray-400 text-left text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e._id} className="border-t border-gray-800">
                    <td className="px-4 py-3 text-gray-200">{e.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${badgeClasses(e.category)}`}>
                        {e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-200">
                      {currency(Number(e.amount))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => onEdit(e)} className="text-sm text-sky-400 hover:text-sky-300 mr-3">Edit</button>
                      <button onClick={() => onDelete(e._id)} className="text-sm text-rose-500 hover:text-rose-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile */}
          <div className="sm:hidden space-y-3">
            {expenses.map((e) => (
              <div key={e._id} className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">{e.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(e.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${badgeClasses(e.category)}`}>
                    {e.category}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-gray-100 font-semibold">
                    {currency(Number(e.amount))}
                  </div>
                  <div>
                    <button onClick={() => onEdit(e)} className="text-sm text-sky-400 hover:text-sky-300 mr-3">Edit</button>
                    <button onClick={() => onDelete(e._id)} className="text-sm text-rose-500 hover:text-rose-400">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}