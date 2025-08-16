import logo from "./assets/logo.png";

function App() {
  

  return (
    <div className="bg-black min-h-screen font-sans text-gray-300">
      <header className="bg-[#171717] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Pocket Guru Logo" className="h-10 w-10" />
            <div className="pb-1">
              <div className="text-xl font-bold text-white">Pocket Guru</div>
              <div className="text-xs text-gray-400 -mt-0.5">Your personal expense tracker</div>
            </div>
          </div>
          <a
            href="#add-expense"
            className="bg-white text-black px-3 py-2 rounded-md font-semibold hover:bg-gray-200"
          >
            Add Expense
          </a>
        </div>
      </header>

      

      <footer className="bg-[#171717] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-sm text-gray-500">&copy; 2025 Pocket Guru. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
