import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    setEmail("jd@ex.com");
    setPassword("123456");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = api.post("/api/auth/login", { email, password });

    toast.promise(promise, {
      loading: 'Logging in...',
      success: (response) => {
        login(response.data.token);
        navigate("/");
        return 'Successfully logged in!';
      },
      error: (err) => err.response?.data?.error || "Failed to login.",
    });
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#0f0f0f] border border-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200">
          Login
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mt-3 bg-gray-700 text-gray-200 font-semibold py-2 rounded-md hover:bg-gray-600"
        >
          Use Demo Account
        </button>
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account? <Link to="/register" className="text-sky-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}