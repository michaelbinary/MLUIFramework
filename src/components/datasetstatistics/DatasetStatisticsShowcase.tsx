// @ts-nocheck

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DatasetStatistics } from './DatasetStatistics';

// Generate sample dataset statistics
const generateSampleData = () => {
  const numericFeature = {
    name: 'price',
    type: 'numeric' as const,
    stats: {
      count: 10000,
      missing: 42,
      unique: 956,
      mean: 245.67,
      std: 123.45,
      min: 0,
      max: 999.99,
      median: 235.50,
      mode: 199.99,
      distribution: Array.from({ length: 10 }, (_, i) => ({
        value: (i * 100).toString(),
        count: Math.floor(Math.random() * 1000 + 500)
      })),
      correlations: {
        'quantity': 0.45,
        'discount': -0.32
      }
    },
    quality: {
      completeness: 0.996,
      uniqueness: 0.0956,
      issues: [
        {
          type: 'warning',
          message: 'Contains 3 potential outliers'
        }
      ]
    }
  };

  const categoricalFeature = {
    name: 'category',
    type: 'categorical' as const,
    stats: {
      count: 10000,
      missing: 0,
      unique: 5,
      mode: 'Electronics',
      distribution: [
        { value: 'Electronics', count: 3500 },
        { value: 'Clothing', count: 2800 },
        { value: 'Books', count: 2000 },
        { value: 'Home', count: 1200 },
        { value: 'Other', count: 500 }
      ]
    },
    quality: {
      completeness: 1.0,
      uniqueness: 0.0005
    }
  };

  return [
    numericFeature,
    categoricalFeature,
    {
      ...numericFeature,
      name: 'quantity',
      stats: {
        ...numericFeature.stats,
        mean: 3.45,
        std: 2.1,
        min: 1,
        max: 20
      }
    },
    {
      ...categoricalFeature,
      name: 'status',
      stats: {
        ...categoricalFeature.stats,
        unique: 3,
        distribution: [
            { value: 'Active', count: 7000 },
            { value: 'Pending', count: 2500 },
            { value: 'Inactive', count: 500 }
          ]
        }
      }
    ];
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
              checked={values.showCorrelations}
              onChange={(e) => onChange({ ...values, showCorrelations: e.target.checked })}
              className="rounded border-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-700">Show Correlations</span>
          </label>
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
              checked={values.showQualityMetrics}
              onChange={(e) => onChange({ ...values, showQualityMetrics: e.target.checked })}
              className="rounded border-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-700">Show Quality Metrics</span>
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
  
  export const DatasetStatisticsShowcase = () => {
    const [activeTab, setActiveTab] = useState('preview');
    const [config, setConfig] = useState({
      theme: 'light',
      variant: 'default',
      colorScale: 'blue',
      showCorrelations: true,
      showDistributions: true,
      showQualityMetrics: true
    });
  
    const sampleData = generateSampleData();
  
    const generateCode = () => {
      const props = [];
      if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
      if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
      if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
      if (!config.showCorrelations) props.push('showCorrelations={false}');
      if (!config.showDistributions) props.push('showDistributions={false}');
      if (!config.showQualityMetrics) props.push('showQualityMetrics={false}');
  
      return `<DatasetStatistics
    features={${JSON.stringify(sampleData.slice(0, 2), null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
  />`;
    };
  
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="border-b border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                Dataset Statistics Component
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
                  <DatasetStatistics
                    features={sampleData}
                    theme={config.theme}
                    variant={config.variant}
                    colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                    showCorrelations={config.showCorrelations}
                    showDistributions={config.showDistributions}
                    showQualityMetrics={config.showQualityMetrics}
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
  
  export default DatasetStatisticsShowcase;