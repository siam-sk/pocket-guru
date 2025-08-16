import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      await api.post("/api/auth/register", { email, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to register.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#0f0f0f] border border-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
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
            placeholder="Password (min 6 characters)"
            className="w-full bg-[#171717] border border-gray-800 text-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-md">
          Register
        </button>
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account? <Link to="/login" className="text-sky-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}