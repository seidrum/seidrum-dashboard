import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

interface Props {
  steps: Step[];
  current: number;
}

export function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors ${
              index < current
                ? 'bg-violet-600 text-white'
                : index === current
                  ? 'bg-violet-600 text-white ring-2 ring-violet-400 ring-offset-2 ring-offset-gray-950'
                  : 'bg-gray-800 text-gray-500'
            }`}
          >
            {index < current ? <Check className="h-5 w-5" /> : step.number}
          </div>
          <span
            className={`hidden text-sm font-medium sm:inline ${
              index <= current ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`mx-2 h-1 w-8 rounded transition-colors ${
                index < current ? 'bg-violet-600' : 'bg-gray-800'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
