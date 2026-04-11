import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authAPI.login(
        formData.email,
        formData.password,
        formData.role
      );
      if (response?.token) {
        onLogin?.(response);
        navigate("/advertiser");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1929] to-[#040910] text-white">
      <main className="flex items-center justify-center py-14 px-4">
        <div className="w-full max-w-xl bg-[#0F1F36]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur">
          <div className="px-10 pt-10 pb-4 text-center">
            <div className="w-12 h-12 rounded-full bg-sky-600/30 border border-sky-500/40 mx-auto mb-4 flex items-center justify-center">
              <span className="font-semibold text-sky-300">7</span>
            </div>
            <h1 className="text-xl font-semibold mb-1">Login with your account</h1>
            <p className="text-sm text-gray-300">Welcome back advertiser</p>
          </div>

          {error && (
            <div className="mx-10 mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-sky-300 hover:text-sky-200"
              >
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center text-sm text-gray-300">
              Don’t have an account?{" "}
              <Link to="/register" className="text-sky-300 hover:text-sky-200">
                Sign Up.
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

