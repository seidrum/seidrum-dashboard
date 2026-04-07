import { CheckCircle2, Loader2 } from 'lucide-react';
import type { Preset, ApplyPresetResponse } from '@/api/management';

interface Props {
  preset: Preset;
  result: ApplyPresetResponse;
  onFinish: () => Promise<void>;
  isFinishing: boolean;
}

export function TestStep({ preset, result, onFinish, isFinishing }: Props) {
  const getTestInstructions = (): string => {
    if (preset.test_instruction) return preset.test_instruction;

    switch (preset.id) {
      case 'telegram':
        return 'Send a message to your Telegram bot to test it. Look for the bot token in Settings > Integrations > Telegram.';
      case 'cli':
        return 'Test the CLI by running: seidrum-cli hello\n\nThe kernel will process your input and respond.';
      case 'api':
        return 'Test the API with: curl -X POST http://localhost:3030/api/v1/conversations -H "Content-Type: application/json" -d \'{"input":"hello"}\'';
      default:
        return 'Your preset has been successfully activated. Refer to the documentation for next steps.';
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-green-800/50 bg-green-900/20 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <h3 className="font-semibold text-green-100">Setup Complete!</h3>
        </div>
        <p className="mt-3 text-sm text-green-200">
          Your Seidrum instance is now configured and ready to use.
        </p>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
        <h4 className="font-semibold text-gray-100">What was enabled</h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium text-gray-400">PLUGINS</div>
            <ul className="mt-2 space-y-1">
              {result.plugins_enabled.map(plugin => (
                <li key={plugin} className="text-sm text-gray-300">
                  {plugin}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400">AGENTS</div>
            <ul className="mt-2 space-y-1">
              {result.agents_enabled.map(agent => (
                <li key={agent} className="text-sm text-gray-300">
                  {agent}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-800/50 bg-blue-900/20 p-4">
        <h4 className="font-semibold text-blue-100">Test Your Setup</h4>
        <pre className="mt-3 whitespace-pre-wrap rounded bg-gray-950 p-3 text-xs text-gray-300">
          {getTestInstructions()}
        </pre>
      </div>

      {result.missing_env.length > 0 && (
        <div className="rounded-lg border border-yellow-800/50 bg-yellow-900/20 p-4">
          <h4 className="font-semibold text-yellow-100">Missing Environment Variables</h4>
          <p className="mt-2 text-sm text-yellow-200">
            The following optional environment variables are not set. Your preset will work, but consider
            setting them for full functionality:
          </p>
          <ul className="mt-2 space-y-1">
            {result.missing_env.map(key => (
              <li key={key} className="text-sm text-yellow-300 before:mr-2 before:content-['•']">
                {key}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onFinish}
        disabled={isFinishing}
        className="w-full rounded-lg bg-violet-600 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {isFinishing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Finishing...
          </div>
        ) : (
          'Finish Setup'
        )}
      </button>
    </div>
  );
}
