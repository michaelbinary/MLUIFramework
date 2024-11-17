// src/components/training/TrainingProgressShowcase.tsx

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { TrainingProgress } from './TrainingProgress';

const INITIAL_TRAINING_STATE = {
  epoch: 0,
  totalEpochs: 100,
  loss: 2.3,
  accuracy: 0.5,
  learningRate: 0.001
};

const Controls = ({ values, onChange }) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-neutral-200">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Theme
        </label>
        <select
          value={values.theme}
          onChange={(e) => onChange({ ...values, theme: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Variant
        </label>
        <select
          value={values.variant}
          onChange={(e) => onChange({ ...values, variant: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.animate}
            onChange={(e) => onChange({ ...values, animate: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Animate Training</span>
        </label>
      </div>
    </div>
  );
};

const CodeBlock = ({ code, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 
                 text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

export const TrainingProgressShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    animate: true
  });
  const [trainingState, setTrainingState] = useState(INITIAL_TRAINING_STATE);

  // Simulate training progress
  useEffect(() => {
    if (!config.animate) {
      setTrainingState(INITIAL_TRAINING_STATE);
      return;
    }

    const interval = setInterval(() => {
      setTrainingState(prev => {
        if (prev.epoch >= prev.totalEpochs) {
          clearInterval(interval);
          return prev;
        }

        const progress = prev.epoch / prev.totalEpochs;
        return {
          ...prev,
          epoch: prev.epoch + 1,
          loss: Math.max(0.1, 2.3 * (1 - progress)),
          accuracy: Math.min(0.99, 0.5 + (0.45 * progress)),
          learningRate: 0.001 * Math.pow(0.1, progress * 2)
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [config.animate]);

  const generateCode = () => {
    const { epoch, totalEpochs, loss, accuracy, learningRate } = trainingState;
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);

    return `<TrainingProgress
  epoch={${epoch}}
  totalEpochs={${totalEpochs}}
  loss={${loss.toFixed(4)}}
  accuracy={${accuracy.toFixed(4)}}
  learningRate={${learningRate}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Training Progress Component
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'preview' 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'code' 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Code
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1">
            <Controls values={config} onChange={setConfig} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'preview' ? (
              <div className={config.theme === 'dark' ? 'bg-neutral-900 p-6 rounded-lg' : 'bg-neutral-50 p-6 rounded-lg'}>
                <TrainingProgress
                  {...trainingState}
                  theme={config.theme}
                  variant={config.variant}
                />
              </div>
            ) : (
              <CodeBlock 
                code={generateCode()}
                onCopy={() => navigator.clipboard.writeText(generateCode())}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgressShowcase;