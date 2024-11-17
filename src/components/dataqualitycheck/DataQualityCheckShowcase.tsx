// src/components/dataqualitycheck/DataQualityCheckShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DataQualityCheck } from './DataQualityCheck';

// Generate sample data quality stats for different scenarios
const generateDatasetStats = (scenario: 'clean' | 'messy' | 'mixed' | 'timeseries') => {
  const baseStats = {
    totalCount: 10000,
    uniqueCount: 0,
    missingCount: 0
  };

  switch (scenario) {
    case 'clean':
      return [
        {
          fieldName: 'age',
          dataType: 'numeric',
          ...baseStats,
          uniqueCount: 72,
          missingCount: 12,
          outlierCount: 5,
          distribution: Array.from({ length: 8 }, (_, i) => ({
            value: i * 10 + 20,
            count: Math.floor(1000 + Math.random() * 500)
          })),
          statistics: {
            mean: 45.2,
            median: 44.0,
            std: 15.3,
            min: 18,
            max: 95,
            q1: 32,
            q3: 58
          },
          validationRules: [
            { rule: 'Value between 0 and 120', passed: true },
            { rule: 'No negative values', passed: true },
            { rule: 'Less than 1% missing', passed: true }
          ]
        },
        {
          fieldName: 'income',
          dataType: 'numeric',
          ...baseStats,
          uniqueCount: 2456,
          missingCount: 45,
          outlierCount: 23,
          distribution: Array.from({ length: 6 }, (_, i) => ({
            value: i * 20000 + 30000,
            count: Math.floor(800 + Math.random() * 600)
          })),
          statistics: {
            mean: 65000,
            median: 62000,
            std: 25000,
            min: 25000,
            max: 150000,
            q1: 45000,
            q3: 85000
          },
          validationRules: [
            { rule: 'Positive values only', passed: true },
            { rule: 'Within expected range', passed: true }
          ]
        },
        {
          fieldName: 'category',
          dataType: 'categorical',
          ...baseStats,
          uniqueCount: 5,
          missingCount: 0,
          distribution: [
            { value: 'A', count: 2500 },
            { value: 'B', count: 2300 },
            { value: 'C', count: 2100 },
            { value: 'D', count: 1800 },
            { value: 'E', count: 1300 }
          ],
          validationRules: [
            { rule: 'Valid category values', passed: true },
            { rule: 'No missing values', passed: true }
          ]
        }
      ];

    case 'messy':
      return [
        {
          fieldName: 'user_age',
          dataType: 'numeric',
          ...baseStats,
          uniqueCount: 156,
          missingCount: 1245,
          outlierCount: 324,
          distribution: Array.from({ length: 8 }, (_, i) => ({
            value: i * 10 + 20,
            count: Math.floor(500 + Math.random() * 1000)
          })),
          statistics: {
            mean: 42.8,
            median: 41.0,
            std: 22.4,
            min: -5,
            max: 156,
            q1: 28,
            q3: 62
          },
          validationRules: [
            { rule: 'Value between 0 and 120', passed: false, failureCount: 89 },
            { rule: 'No negative values', passed: false, failureCount: 23 },
            { rule: 'Less than 1% missing', passed: false, failureCount: 1245 }
          ]
        },
        {
          fieldName: 'email',
          dataType: 'string',
          ...baseStats,
          uniqueCount: 8756,
          missingCount: 567,
          distribution: [
            { value: 'Valid', count: 8245 },
            { value: 'Invalid', count: 1188 },
            { value: 'Missing', count: 567 }
          ],
          validationRules: [
            { rule: 'Valid email format', passed: false, failureCount: 1188 },
            { rule: 'No missing values', passed: false, failureCount: 567 },
            { rule: 'Unique values', passed: false, failureCount: 234 }
          ]
        }
      ];

    case 'timeseries':
      return [
        {
          fieldName: 'timestamp',
          dataType: 'datetime',
          ...baseStats,
          uniqueCount: 9998,
          missingCount: 0,
          distribution: Array.from({ length: 6 }, (_, i) => ({
            value: `2024-0${i + 1}`,
            count: Math.floor(1500 + Math.random() * 300)
          })),
          validationRules: [
            { rule: 'Valid datetime format', passed: true },
            { rule: 'No future dates', passed: true },
            { rule: 'No duplicates', passed: true }
          ]
        },
        {
          fieldName: 'value',
          dataType: 'numeric',
          ...baseStats,
          uniqueCount: 3456,
          missingCount: 123,
          outlierCount: 45,
          distribution: Array.from({ length: 8 }, (_, i) => ({
            value: i * 25,
            count: Math.floor(800 + Math.random() * 400)
          })),
          statistics: {
            mean: 87.5,
            median: 86.2,
            std: 12.4,
            min: 45.2,
            max: 142.8,
            q1: 76.5,
            q3: 98.3
          },
          validationRules: [
            { rule: 'Within expected range', passed: true },
            { rule: 'No sudden spikes', passed: false, failureCount: 12 }
          ]
        }
      ];

    default: // mixed
      return [
        {
          fieldName: 'id',
          dataType: 'string',
          ...baseStats,
          uniqueCount: 9987,
          missingCount: 0,
          validationRules: [
            { rule: 'Unique values', passed: true },
            { rule: 'Valid format', passed: true }
          ]
        },
        {
          fieldName: 'status',
          dataType: 'categorical',
          ...baseStats,
          uniqueCount: 4,
          missingCount: 234,
          distribution: [
            { value: 'Active', count: 5600 },
            { value: 'Pending', count: 2300 },
            { value: 'Inactive', count: 1866 },
            { value: 'Unknown', count: 234 }
          ],
          validationRules: [
            { rule: 'Valid status values', passed: true },
            { rule: 'Less than 5% unknown', passed: true }
          ]
        }
      ];
  }
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Dataset Type
        </label>
        <select
          value={values.dataset}
          onChange={(e) => onChange({ ...values, dataset: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="clean">Clean Dataset</option>
          <option value="messy">Problematic Dataset</option>
          <option value="mixed">Mixed Quality Dataset</option>
          <option value="timeseries">Time Series Dataset</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Color Scale
        </label>
        <select
          value={values.colorScale}
          onChange={(e) => onChange({ ...values, colorScale: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showDistributions}
            onChange={(e) => onChange({ ...values, showDistributions: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Distributions</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showValidation}
            onChange={(e) => onChange({ ...values, showValidation: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Validation</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.interactive}
            onChange={(e) => onChange({ ...values, interactive: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Interactive Mode</span>
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

export const DataQualityCheckShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    dataset: 'clean',
    colorScale: 'blue',
    showDistributions: true,
    showValidation: true,
    interactive: true
  });

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (!config.showDistributions) props.push('showDistributions={false}');
    if (!config.showValidation) props.push('showValidation={false}');
    if (!config.interactive) props.push('interactive={false}');

    return `<DataQualityCheck
  data={${JSON.stringify(generateDatasetStats('clean').slice(0, 1), null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Data Quality Check Component
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
                <DataQualityCheck
                  data={generateDatasetStats(config.dataset as any)}
                  // src/components/dataqualitycheck/DataQualityCheckShowcase.tsx (continued)

                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  showDistributions={config.showDistributions}
                  showValidation={config.showValidation}
                  interactive={config.interactive}
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

export default DataQualityCheckShowcase;