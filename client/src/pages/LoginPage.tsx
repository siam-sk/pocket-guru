import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/auth/login", { email, password });
      login(response.data.token);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        setError((err.response.data as { error: string }).error);
      } else {
        setError("Failed to login.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#0f0f0f] border border-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
        <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-md">
          Login
        </button>
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account? <Link to="/register" className="text-sky-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}