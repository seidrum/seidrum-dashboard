import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usePresets,
  useApplyPreset,
  useCompleteOnboarding,
  useSetEnvVar,
} from '@/hooks/useOnboarding';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { PresetCard } from '@/components/onboarding/PresetCard';
import { ConfigForm } from '@/components/onboarding/ConfigForm';
import { ActivationSummary } from '@/components/onboarding/ActivationSummary';
import { TestStep } from '@/components/onboarding/TestStep';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { Preset, ApplyPresetResponse } from '@/api/management';

const STEPS = [
  { number: 1, label: 'Welcome' },
  { number: 2, label: 'Configure' },
  { number: 3, label: 'Activate' },
  { number: 4, label: 'Test' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [includeRecommended, setIncludeRecommended] = useState(true);
  const [activationResult, setActivationResult] = useState<ApplyPresetResponse | null>(null);
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const [activationError, setActivationError] = useState<string | null>(null);

  const { data: presets, isLoading: presetsLoading } = usePresets();
  const applyPresetMutation = useApplyPreset();
  const completeMutation = useCompleteOnboarding();
  const setEnvMutation = useSetEnvVar();

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
  };

  const handleNextFromWelcome = () => {
    if (selectedPreset) setStep(1);
  };

  const handleConfigSaved = async (values: Record<string, string>) => {
    const errors: string[] = [];
    for (const [key, value] of Object.entries(values)) {
      if (value.trim()) {
        try {
          await setEnvMutation.mutateAsync({ key, value });
        } catch (err) {
          errors.push(`Failed to set ${key}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    }
    if (errors.length > 0) {
      setConfigErrors(errors);
      return;
    }
    setStep(2);
  };

  const handleActivatePreset = async () => {
    if (!selectedPreset) return;
    setActivationError(null);
    try {
      const result = await applyPresetMutation.mutateAsync({
        id: selectedPreset.id,
        body: { include_recommended: includeRecommended },
      });
      setActivationResult(result);
      setStep(3);
    } catch (err) {
      setActivationError(err instanceof Error ? err.message : 'Failed to activate preset');
    }
  };

  const handleFinish = async () => {
    try {
      await completeMutation.mutateAsync();
      navigate('/');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  };

  if (presetsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 text-4xl">🌟</div>
          <h1 className="text-3xl font-bold text-gray-100">Welcome to Seidrum</h1>
          <p className="mt-2 text-gray-400">
            Set up your personal AI agent platform in just a few minutes
          </p>
        </div>

        <div className="mb-12">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8">
          {step === 0 && (
            <StepWelcome
              presets={presets}
              selectedPreset={selectedPreset}
              onSelectPreset={handleSelectPreset}
              onNext={handleNextFromWelcome}
            />
          )}

          {step === 1 && selectedPreset && (
            <StepConfigure
              preset={selectedPreset}
              onSave={handleConfigSaved}
              isSaving={setEnvMutation.isPending}
              errors={configErrors}
            />
          )}

          {step === 2 && selectedPreset && (
            <StepActivate
              preset={selectedPreset}
              includeRecommended={includeRecommended}
              onToggleRecommended={() => setIncludeRecommended(!includeRecommended)}
              onActivate={handleActivatePreset}
              isActivating={applyPresetMutation.isPending}
              error={activationError}
            />
          )}

          {step === 3 && selectedPreset && activationResult && (
            <StepTest
              preset={selectedPreset}
              result={activationResult}
              onFinish={handleFinish}
              isFinishing={completeMutation.isPending}
            />
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              if (step > 0) setStep(step - 1);
            }}
            disabled={step === 0}
            className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:border-gray-600 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {step < 3 && (
            <button
              onClick={() => {
                if (step === 0) handleNextFromWelcome();
              }}
              disabled={step !== 0 || !selectedPreset}
              className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepWelcomeProps {
  presets?: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset) => void;
  onNext: () => void;
}

function StepWelcome({
  presets,
  selectedPreset,
  onSelectPreset,
  onNext,
}: StepWelcomeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">Choose your setup</h2>
        <p className="mt-2 text-gray-400">
          Select a preset that matches how you want to interact with Seidrum
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {presets?.map(preset => (
          <PresetCard
            key={preset.id}
            preset={preset}
            selected={selectedPreset?.id === preset.id}
            onSelect={() => onSelectPreset(preset)}
          />
        ))}
      </div>

      {selectedPreset && (
        <div className="rounded-lg border border-violet-800/50 bg-violet-900/20 p-4">
          <p className="text-sm text-violet-200">
            {selectedPreset.name} includes everything you need to get started. You can enable
            additional plugins and agents later.
          </p>
        </div>
      )}
    </div>
  );
}

interface StepConfigureProps {
  preset: Preset;
  onSave: (values: Record<string, string>) => Promise<void>;
  isSaving: boolean;
  errors?: string[];
}

function StepConfigure({ preset, onSave, isSaving, errors = [] }: StepConfigureProps) {
  if (!preset.env_required.length) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Configuration</h2>
          <p className="mt-2 text-gray-400">{preset.name} requires no configuration</p>
        </div>
        <div className="rounded-lg border border-green-800/50 bg-green-900/20 p-4">
          <p className="text-sm text-green-200">Ready to proceed to activation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">Configure {preset.name}</h2>
        <p className="mt-2 text-gray-400">
          Enter the required credentials and configuration for this preset
        </p>
      </div>
      <ConfigForm requirements={preset.env_required} onSave={onSave} />
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}
    </div>
  );
}

interface StepActivateProps {
  preset: Preset;
  includeRecommended: boolean;
  onToggleRecommended: () => void;
  onActivate: () => Promise<void>;
  isActivating: boolean;
  error?: string | null;
}

function StepActivate({
  preset,
  includeRecommended,
  onToggleRecommended,
  onActivate,
  isActivating,
  error,
}: StepActivateProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">Activate {preset.name}</h2>
        <p className="mt-2 text-gray-400">
          Review what will be enabled and confirm to activate your preset
        </p>
      </div>
      <ActivationSummary
        preset={preset}
        includeRecommended={includeRecommended}
        onToggleRecommended={onToggleRecommended}
        onActivate={onActivate}
        isActivating={isActivating}
      />
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

interface StepTestProps {
  preset: Preset;
  result: ApplyPresetResponse;
  onFinish: () => Promise<void>;
  isFinishing: boolean;
}

function StepTest({ preset, result, onFinish, isFinishing }: StepTestProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">Setup Complete</h2>
        <p className="mt-2 text-gray-400">Your Seidrum instance is ready to use</p>
      </div>
      <TestStep preset={preset} result={result} onFinish={onFinish} isFinishing={isFinishing} />
    </div>
  );
}
