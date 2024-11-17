// @ts-nocheck

// src/components/prcurve/PRCurveShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PRCurve } from './PRCurve';

// Generate sample PR curve data
const generatePRData = (quality: 'good' | 'average' | 'poor') => {
  const points = [];
  const numPoints = 100;
  
  for (let i = 0; i <= numPoints; i++) {
    const recall = i / numPoints;
    let precision;
    
    switch (quality) {
      case 'good':
        // High precision maintained even at high recall
        precision = Math.exp(-2 * recall * recall);
        break;
      case 'average':
        // Moderate trade-off between precision and recall
        precision = Math.exp(-recall);
        break;
      case 'poor':
        // Sharp drop in precision as recall increases
        precision = 1 - (0.8 * recall);
        break;
    }
    
    // Add some noise and ensure values are within bounds
    precision = Math.max(0.01, Math.min(1, precision + (Math.random() * 0.05 - 0.025)));
    
    // Calculate F1 score
    const f1Score = 2 * (precision * recall) / (precision + recall);
    
    points.push({
      recall,
      precision,
      f1Score,
      threshold: 1 - (i / numPoints)
    });
  }
  
  // Ensure the curve starts at (0,1) and ends appropriately
  points.unshift({ recall: 0, precision: 1, threshold: 1, f1Score: 0 });
  points.push({ recall: 1, precision: points[points.length - 1].precision, threshold: 0, f1Score: points[points.length - 1].f1Score });
  
  return points;
};

const SAMPLE_DATA = {
  good: generatePRData('good'),
  average: generatePRData('average'),
  poor: generatePRData('poor')
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
          Sample Data
        </label>
        <select
          value={values.dataQuality}
          onChange={(e) => onChange({ ...values, dataQuality: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="good">Good Performance</option>
          <option value="average">Average Performance</option>
          <option value="poor">Poor Performance</option>
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
            checked={values.showGrid}
            onChange={(e) => onChange({ ...values, showGrid: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Grid</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showThresholds}
            onChange={(e) => onChange({ ...values, showThresholds: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Thresholds</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showArea}
            onChange={(e) => onChange({ ...values, showArea: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Area</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showF1Isolines}
            onChange={(e) => onChange({ ...values, showF1Isolines: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show F1 Score Lines</span>
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

export const PRCurveShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    dataQuality: 'good',
    colorScale: 'blue',
    showGrid: true,
    showThresholds: false,
    showArea: false,
    showF1Isolines: false
  });

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (!config.showGrid) props.push('showGrid={false}');
    if (config.showThresholds) props.push('showThresholds={true}');
    if (config.showArea) props.push('showArea={true}');
    if (config.showF1Isolines) props.push('showF1Isolines={true}');

    return `<PRCurve
  data={[
    { recall: 0, precision: 1, threshold: 1 },
    { recall: 0.2, precision: 0.95, threshold: 0.8 },
    { recall: 0.4, precision: 0.85, threshold: 0.6 },
    // ... more data points
    { recall: 1, precision: 0.6, threshold: 0 }
  ]}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Precision-Recall Curve Component
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
                <PRCurve
                  data={SAMPLE_DATA[config.dataQuality as keyof typeof SAMPLE_DATA]}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  showGrid={config.showGrid}
                  showThresholds={config.showThresholds}
                  showArea={config.showArea}
                  showF1Isolines={config.showF1Isolines}
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

export default PRCurveShowcase;