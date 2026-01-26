import React from 'react';

interface FormSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

export const FormSlider: React.FC<FormSliderProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</label>
        <span className="text-lg font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-200 dark:bg-cyan-700 px-3 py-1 rounded-lg">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gradient-to-r from-cyan-200 dark:from-cyan-600 to-blue-200 dark:to-blue-600 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, ${
            window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
              ? 'rgb(34, 211, 238)'
              : 'rgb(34, 211, 238)'
          } 0%, rgb(34, 211, 238) ${
            ((value - min) / (max - min)) * 100
          }%, ${
            window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
              ? 'rgb(51, 65, 85)'
              : 'rgb(229, 231, 235)'
          } ${((value - min) / (max - min)) * 100}%, ${
            window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
              ? 'rgb(51, 65, 85)'
              : 'rgb(229, 231, 235)'
          } 100%)`,
        }}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(6, 182, 212), rgb(59, 130, 246));
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(6, 182, 212), rgb(59, 130, 246));
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          border: none;
        }
      `}</style>
    </div>
  );
};
