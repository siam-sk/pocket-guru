import { Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="bg-black min-h-screen font-sans text-gray-300 flex flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#171717',
            color: '#fff',
            border: '1px solid #374151'
          },
        }}
      />
      <header className="bg-[#171717] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Pocket Guru Logo" className="h-10 w-10" />
            <div>
              <div className="text-xl font-bold text-white">Pocket Guru</div>
              <div className="text-xs text-gray-400 -mt-0.5">Your personal expense tracker</div>
            </div>
          </Link>
          <div>
            {isAuthenticated ? (
              <button onClick={logout} className="bg-rose-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-rose-700">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-black px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-[#171717] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-sm text-gray-500">&copy; 2025 Pocket Guru. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}