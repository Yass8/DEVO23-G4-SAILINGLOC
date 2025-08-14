import { useState } from "react";

const PasswordInput = ({ id, name, label, value, onChange, disabled, placeholder, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required
          className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors pr-12 disabled:bg-gray-100 ${
            error ? "border-red-300 focus:border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#AD7C59] transition-colors disabled:opacity-50"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;