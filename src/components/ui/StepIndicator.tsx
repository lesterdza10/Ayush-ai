import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Dots */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                transition-all duration-300
                ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : index === currentStep
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white scale-110 shadow-lg'
                    : 'bg-gray-200/50 text-gray-600'
                }
              `}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`
                text-xs font-medium text-center hidden md:block
                ${index <= currentStep ? 'text-gray-800' : 'text-gray-400'}
              `}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
