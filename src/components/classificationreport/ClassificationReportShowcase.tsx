// @ts-nocheck

// src/components/classificationreport/ClassificationReportShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ClassificationReport } from './ClassificationReport';

// Sample datasets
const SAMPLE_DATA = {
  binary: {
    'Class 0': {
      precision: 0.92,
      recall: 0.89,
      f1Score: 0.905,
      support: 1250,
      specificity: 0.91,
      accuracy: 0.90
    },
    'Class 1': {
      precision: 0.88,
      recall: 0.91,
      f1Score: 0.895,
      support: 1150,
      specificity: 0.89,
      accuracy: 0.89
    }
  },
  multiclass: {
    'Cat': {
      precision: 0.89,
      recall: 0.92,
      f1Score: 0.905,
      support: 850,
      specificity: 0.94,
      accuracy: 0.91
    },
    'Dog': {
      precision: 0.87,
      recall: 0.85,
      f1Score: 0.86,
      support: 920,
      specificity: 0.92,
      accuracy: 0.88
    },
    'Bird': {
      precision: 0.91,
      recall: 0.88,
      f1Score: 0.895,
      support: 780,
      specificity: 0.95,
      accuracy: 0.92
    },
    'Fish': {
      precision: 0.86,
      recall: 0.83,
      f1Score: 0.845,
      support: 690,
      specificity: 0.91,
      accuracy: 0.87
    }
  },
  imbalanced: {
    'Rare Event': {
      precision: 0.95,
      recall: 0.62,
      f1Score: 0.75,
      support: 150,
      specificity: 0.99,
      accuracy: 0.97
    },
    'Common Event': {
      precision: 0.86,
      recall: 0.99,
      f1Score: 0.92,
      support: 2250,
      specificity: 0.62,
      accuracy: 0.95
    }
  }
};

const METRIC_OPTIONS = [
  { value: 'precision', label: 'Precision' },
  { value: 'recall', label: 'Recall' },
  { value: 'f1Score', label: 'F1 Score' },
  { value: 'support', label: 'Support' },
  { value: 'specificity', label: 'Specificity' },
  { value: 'accuracy', label: 'Accuracy' }
];

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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Dataset
        </label>
        <select
          value={values.dataset}
          onChange={(e) => onChange({ ...values, dataset: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="binary">Binary Classification</option>
          <option value="multiclass">Multi-class Classification</option>
          <option value="imbalanced">Imbalanced Dataset</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Metrics
        </label>
        <div className="space-y-2">
          {METRIC_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.metrics.includes(option.value)}
                onChange={(e) => {
                  const newMetrics = e.target.checked
                    ? [...values.metrics, option.value]
                    : values.metrics.filter(m => m !== option.value);
                  onChange({ ...values, metrics: newMetrics });
                }}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showCharts}
            onChange={(e) => onChange({ ...values, showCharts: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Charts</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showSearch}
            onChange={(e) => onChange({ ...values, showSearch: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Search</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.sortable}
            onChange={(e) => onChange({ ...values, sortable: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Enable Sorting</span>
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

export const ClassificationReportShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    dataset: 'multiclass',
    metrics: ['precision', 'recall', 'f1Score', 'support'],
    showCharts: true,
    showSearch: false,
    sortable: true
  });

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (!config.showCharts) props.push('showCharts={false}');
    if (config.showSearch) props.push('showSearch={true}');
    if (!config.sortable) props.push('sortable={false}');
    if (config.metrics.length !== 4 || 
        !config.metrics.every(m => ['precision', 'recall', 'f1Score', 'support'].includes(m))) {
      props.push(`metrics={${JSON.stringify(config.metrics)}}`);
    }

    return `<ClassificationReport
  data={${JSON.stringify(SAMPLE_DATA[config.dataset as keyof typeof SAMPLE_DATA], null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Classification Report Component
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
                <ClassificationReport
                  data={SAMPLE_DATA[config.dataset as keyof typeof SAMPLE_DATA]}
                  theme={config.theme}
                  variant={config.variant}
                  metrics={config.metrics as any[]}
                  showCharts={config.showCharts}
                  showSearch={config.showSearch}
                  sortable={config.sortable}
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

export default ClassificationReportShowcase;