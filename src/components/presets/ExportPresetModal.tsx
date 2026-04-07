import { useState } from 'react';
import { X, Copy, Download, CheckCircle2 } from 'lucide-react';
import type { PresetExport } from '@/api/management';

interface ExportPresetModalProps {
  data: PresetExport;
  onClose: () => void;
}

export function ExportPresetModal({ data, onClose }: ExportPresetModalProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'preset' | 'agents' | 'prompts'>('preset');

  const handleCopyToClipboard = async () => {
    const yaml = generatePresetYaml(data);
    await navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const yaml = generatePresetYaml(data);
    const blob = new Blob([yaml], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.preset.id}-preset.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="export-preset-title">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="export-preset-title" className="text-xl font-semibold text-gray-100">Export Preset</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setTab('preset')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'preset'
                ? 'border-b-2 border-violet-600 text-violet-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Preset Definition
          </button>
          {Object.keys(data.agents).length > 0 && (
            <button
              onClick={() => setTab('agents')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === 'agents'
                  ? 'border-b-2 border-violet-600 text-violet-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Agents ({Object.keys(data.agents).length})
            </button>
          )}
          {Object.keys(data.prompts).length > 0 && (
            <button
              onClick={() => setTab('prompts')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === 'prompts'
                  ? 'border-b-2 border-violet-600 text-violet-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Prompts ({Object.keys(data.prompts).length})
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 mb-6 rounded-lg border border-gray-700 bg-gray-950 p-4 overflow-auto">
          {tab === 'preset' && (
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-words">
              {generatePresetYaml(data)}
            </pre>
          )}

          {tab === 'agents' && (
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-words">
              {generateAgentsYaml(data.agents)}
            </pre>
          )}

          {tab === 'prompts' && (
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap break-words">
              {generatePromptsYaml(data.prompts)}
            </pre>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyToClipboard}
            className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
              copied
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </div>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-300 hover:border-gray-600 hover:text-gray-200 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </div>
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-300 hover:border-gray-600 hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function yamlQuote(value: string): string {
  // eslint-disable-next-line no-useless-escape
  if (/[:{}\[\],&*#?|\-><!%@`"'\n]/.test(value) || value.trim() !== value) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
  }
  return value;
}

function generatePresetYaml(data: PresetExport): string {
  const { preset } = data;
  const envRequiredList = preset.env_required && preset.env_required.length > 0
    ? preset.env_required.map(e => `    - ${yamlQuote(e.key)}`).join('\n')
    : '';

  return `id: ${yamlQuote(preset.id)}
name: ${yamlQuote(preset.name)}
description: ${yamlQuote(preset.description)}
icon: ${yamlQuote(preset.icon)}
source: ${yamlQuote(preset.source)}
${preset.version ? `version: ${yamlQuote(preset.version)}\n` : ''}${preset.author ? `author: ${yamlQuote(preset.author)}\n` : ''}${preset.repository ? `repository: ${yamlQuote(preset.repository)}\n` : ''}llm_provider: ${preset.llm_provider ? yamlQuote(preset.llm_provider) : 'null'}

plugins:
  required:
${preset.plugins.required.map(p => `    - ${yamlQuote(p)}`).join('\n')}
  recommended:
${preset.plugins.recommended.map(p => `    - ${yamlQuote(p)}`).join('\n')}

agents:
  required:
${preset.agents.required.map(a => `    - ${yamlQuote(a)}`).join('\n')}
  recommended:
${preset.agents.recommended.map(a => `    - ${yamlQuote(a)}`).join('\n')}

env_required:
${envRequiredList}
`;
}

function generateAgentsYaml(agents: Record<string, string>): string {
  const lines = ['agents:'];
  for (const [name, content] of Object.entries(agents)) {
    lines.push(`  ${name}: |`);
    content
      .split('\n')
      .forEach(line => {
        lines.push(`    ${line}`);
      });
  }
  return lines.join('\n');
}

function generatePromptsYaml(prompts: Record<string, string>): string {
  const lines = ['prompts:'];
  for (const [name, content] of Object.entries(prompts)) {
    lines.push(`  ${name}: |`);
    content
      .split('\n')
      .forEach(line => {
        lines.push(`    ${line}`);
      });
  }
  return lines.join('\n');
}
