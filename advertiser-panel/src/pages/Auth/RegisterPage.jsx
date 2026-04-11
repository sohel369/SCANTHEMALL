import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import { getCountryOptions, getStateOptions, getCityOptions, getPhoneCode } from "../../utils/locationData";

const ROLE_OPTIONS = [
  { value: "advertiser", label: "Advertiser" },
];

export default function RegisterPage({ onRegistered }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    postalCode: "",
    country: "",
    state: "",
    city: "",
    phoneNumber: "",
    role: ROLE_OPTIONS[0].value,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset dependent fields when country or state changes
    if (name === "country") {
      setFormData({
        ...formData,
        [name]: value,
        state: "",
        city: ""
      });
    } else if (name === "state") {
      setFormData({
        ...formData,
        [name]: value,
        city: ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        ...formData,
        position: "Advertiser", // Fixed position for advertiser
      });

      // If backend returns token, use it, otherwise fall back to login
      if (response?.token) {
        onRegistered?.(response);
      } else {
        const loginResponse = await authAPI.login(
          formData.email,
          formData.password,
          formData.role
        );
        onRegistered?.(loginResponse);
      }
      navigate("/advertiser");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = getCountryOptions();
  const stateOptions = getStateOptions(formData.country);
  const cityOptions = getCityOptions(formData.country, formData.state);
  const phoneCode = getPhoneCode(formData.country);

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-[#0F1F36]/80 border border-white/10 rounded-2xl shadow-2xl">
          <div className="px-10 pt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">7</span>
              </div>
              <h1 className="text-2xl font-semibold">Create Advertiser Account</h1>
            </div>
          </div>

          {error && (
            <div className="mx-10 mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Your Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Your Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
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
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Postal/Zip Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Enter location to find postal code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white focus:border-sky-500 focus:outline-none"
                  required
                >
                  <option value="">Select Country</option>
                  {countryOptions.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white focus:border-sky-500 focus:outline-none"
                  required
                  disabled={!formData.country}
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white focus:border-sky-500 focus:outline-none"
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-200">
                  Phone Number
                </label>
                <div className="flex gap-3">
                  <div className="w-28 rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white">
                    {phoneCode}
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
              >
                {loading ? "Creating account..." : "Complete Registration"}
              </button>
              <p className="text-center text-sm text-gray-300 mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-300 hover:text-sky-200">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

