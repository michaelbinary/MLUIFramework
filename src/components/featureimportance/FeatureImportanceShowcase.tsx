// @ts-nocheck

// src/components/featureimportance/FeatureImportanceShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { FeatureImportance } from './FeatureImportance';

// Sample datasets
const SAMPLE_DATA = {
  classification: [
    { name: 'Age', importance: 0.25, category: 'Demographics', value: 34, description: 'Customer age in years' },
    { name: 'Income', importance: 0.22, category: 'Demographics', value: 75000, description: 'Annual income' },
    { name: 'Credit Score', importance: 0.18, category: 'Financial', value: 720, description: 'Credit score' },
    { name: 'Account Balance', importance: 0.15, category: 'Financial', value: 15000, description: 'Current balance' },
    { name: 'Employment Years', importance: 0.12, category: 'Demographics', value: 5, description: 'Years at current job' },
    { name: 'Debt Ratio', importance: 0.08, category: 'Financial', value: 0.3, description: 'Debt to income ratio' }
  ],
  regression: [
    { name: 'Square Footage', importance: 0.35, category: 'Physical', value: 2500, description: 'Total living area' },
    { name: 'Location', importance: 0.25, category: 'Location', value: 'Urban', description: 'Property location type' },
    { name: 'Year Built', importance: 0.15, category: 'Physical', value: 1995, description: 'Year of construction' },
    { name: 'Bedrooms', importance: 0.12, category: 'Physical', value: 4, description: 'Number of bedrooms' },
    { name: 'School Rating', importance: 0.08, category: 'Location', value: 8.5, description: 'Local school rating' },
    { name: 'Crime Rate', importance: 0.05, category: 'Location', value: 'Low', description: 'Area crime rate' }
  ],
  shap: [
    { name: 'Feature 1', importance: 0.28, contribution: 'positive', description: 'Strong positive impact' },
    { name: 'Feature 2', importance: 0.22, contribution: 'negative', description: 'Significant negative impact' },
    { name: 'Feature 3', importance: 0.18, contribution: 'positive', description: 'Moderate positive impact' },
    { name: 'Feature 4', importance: 0.15, contribution: 'negative', description: 'Moderate negative impact' },
    { name: 'Feature 5', importance: 0.12, contribution: 'positive', description: 'Slight positive impact' },
    { name: 'Feature 6', importance: 0.05, contribution: 'negative', description: 'Slight negative impact' }
  ]
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
          Dataset
        </label>
        <select
          value={values.dataset}
          onChange={(e) => onChange({ ...values, dataset: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="classification">Classification Example</option>
          <option value="regression">Regression Example</option>
          <option value="shap">SHAP Values Example</option>
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Orientation
        </label>
        <select
          value={values.orientation}
          onChange={(e) => onChange({ ...values, orientation: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Max Features
        </label>
        <input
          type="number"
          value={values.maxFeatures}
          onChange={(e) => onChange({ ...values, maxFeatures: parseInt(e.target.value) })}
          min={1}
          max={20}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showCategories}
            onChange={(e) => onChange({ ...values, showCategories: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Categories</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showValues}
            onChange={(e) => onChange({ ...values, showValues: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Values</span>
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

export const FeatureImportanceShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    dataset: 'classification',
    colorScale: 'blue',
    orientation: 'horizontal',
    maxFeatures: 6,
    showCategories: true,
    showValues: true
  });

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (config.orientation !== 'horizontal') props.push(`orientation="${config.orientation}"`);
    if (config.maxFeatures !== 10) props.push(`maxFeatures={${config.maxFeatures}}`);
    if (config.showCategories) props.push('showCategories={true}');
    if (!config.showValues) props.push('showValues={false}');

    return `<FeatureImportance
  data={${JSON.stringify(SAMPLE_DATA[config.dataset as keyof typeof SAMPLE_DATA], null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Feature Importance Component
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
                <FeatureImportance
                  data={SAMPLE_DATA[config.dataset as keyof typeof SAMPLE_DATA]}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  orientation={config.orientation as 'horizontal' | 'vertical'}
                  maxFeatures={config.maxFeatures}
                  showCategories={config.showCategories}
                  showValues={config.showValues}
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

export default FeatureImportanceShowcase;