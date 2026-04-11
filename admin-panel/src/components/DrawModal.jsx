import { useState, useEffect } from "react";
import { getCountryOptions, getStateOptions, getCityOptions } from "../utils/locationData";

export default function DrawModal({ isOpen, onClose, onSubmit, draw = null, mode = "create" }) {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
    wave: "1",
    next_number: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (draw && mode === "edit") {
      setFormData({
        name: draw.name || "",
        country: draw.country || "",
        state: draw.state || "",
        city: draw.city || "",
        wave: draw.wave || "1",
        next_number: draw.next_number || 0,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        country: "",
        state: "",
        city: "",
        wave: "1",
        next_number: 0,
      });
    }
  }, [draw, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset dependent fields when country or state changes
    if (name === "country") {
      setFormData({
        ...formData,
        [name]: value,
        state: "",
        city: "",
      });
    } else if (name === "state") {
      setFormData({
        ...formData,
        [name]: value,
        city: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Draw name is required";
    }
    
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    
    if (!formData.wave || parseInt(formData.wave) < 1) {
      newErrors.wave = "Wave must be at least 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    onSubmit(formData);
  };

  const countryOptions = getCountryOptions();
  const stateOptions = getStateOptions(formData.country);
  const cityOptions = getCityOptions(formData.country, formData.state);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E3A5F] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">
            {mode === "create" ? "Create New Draw" : "Edit Draw"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Draw Name */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Draw Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-[#0A1929] border ${
                errors.name ? "border-red-500" : "border-gray-600"
              } rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500`}
              placeholder="e.g., December Luxury Car Draw"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Country and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Country <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full bg-[#0A1929] border ${
                    errors.country ? "border-red-500" : "border-gray-600"
                  } rounded px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500`}
                >
                  <option value="">Select Country</option>
                  {countryOptions.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-red-400">{errors.country}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                State/Province
              </label>
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!formData.country}
                  className="w-full bg-[#0A1929] border border-gray-600 rounded px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              City <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.state && !formData.country}
                className={`w-full bg-[#0A1929] border ${
                  errors.city ? "border-red-500" : "border-gray-600"
                } rounded px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500 disabled:opacity-50`}
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.city && (
              <p className="mt-1 text-sm text-red-400">{errors.city}</p>
            )}
          </div>

          {/* Wave and Next Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Wave <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="wave"
                value={formData.wave}
                onChange={handleChange}
                min="1"
                className={`w-full bg-[#0A1929] border ${
                  errors.wave ? "border-red-500" : "border-gray-600"
                } rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                placeholder="1"
              />
              {errors.wave && (
                <p className="mt-1 text-sm text-red-400">{errors.wave}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Next Number
              </label>
              <input
                type="number"
                name="next_number"
                value={formData.next_number}
                onChange={handleChange}
                min="0"
                className="w-full bg-[#0A1929] border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {mode === "create" ? "Create Draw" : "Update Draw"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
