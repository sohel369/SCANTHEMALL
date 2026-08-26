import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../api/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email, newPassword || undefined);
      setSuccess(true);
      if (response.note) {
        setMessage(response.note);
      } else if (response.message) {
        setMessage(response.message);
      } else {
        setMessage("Password reset successfully!");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. Please check your email.");
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
            <h1 className="text-xl font-semibold mb-1">Reset Your Password</h1>
            <p className="text-sm text-gray-300">Enter your account email and new password to reset</p>
          </div>

          {error && (
            <div className="mx-10 mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mx-10 mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-200">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="flex items-center justify-between text-sm text-gray-300 pt-2">
              <Link to="/login" className="text-sky-300 hover:text-sky-200">
                ← Back to Login
              </Link>
              <Link to="/register" className="text-sky-300 hover:text-sky-200">
                Create New Account
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
