import React from 'react';

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'email' | 'time' |'password';
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border-2 backdrop-blur-sm
          transition-all duration-300
          ${
            error
              ? 'border-red-500 dark:border-red-500 focus:border-red-600'
              : 'border-cyan-300 dark:border-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400'
          }
          focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-400
          placeholder:text-gray-500 dark:placeholder:text-gray-400
          text-gray-900 dark:text-white
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
