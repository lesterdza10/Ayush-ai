import React from 'react';

interface FormSelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border-2 backdrop-blur-sm
          transition-all duration-300 appearance-none
          ${
            error
              ? 'border-red-500 dark:border-red-500 focus:border-red-600'
              : 'border-cyan-300 dark:border-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400'
          }
          focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-400
          text-gray-900 dark:text-white cursor-pointer
        `}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
