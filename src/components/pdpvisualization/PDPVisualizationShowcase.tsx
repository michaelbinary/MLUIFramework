import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PDPVisualization } from './PDPVisualization';

// Generate sample PDP data
const generateSampleData = () => {
  // Generate main PDP curve (age vs prediction)
  const pdpPoints = Array.from({ length: 50 }, (_, i) => {
    const value = 20 + (i * 1.2); // Age from 20 to 80
    const normalizedValue = (value - 20) / 60;
    // Create a non-linear relationship
    const prediction = 0.3 + 
      0.4 * Math.sin(normalizedValue * Math.PI) + 
      0.2 * normalizedValue + 
      0.1 * Math.random();
    
    return {
      value,
      prediction,
      percentile: i / 50,
      frequency: Math.exp(-(Math.pow(normalizedValue - 0.5, 2) / 0.1)) / 4
    };
  });

  // Generate 2D interaction data (age vs income)
  const pdpPoints2D = [];
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      const value = 20 + (i * 3); // age
      const value2 = 20000 + (j * 4000); // income
      const normalizedValue = i / 20;
      const normalizedValue2 = j / 20;
      
      pdpPoints2D.push({
        value,
        value2,
        prediction: 0.3 + 
          0.3 * Math.sin(normalizedValue * Math.PI) + 
          0.2 * normalizedValue2 +
          0.1 * Math.sin(normalizedValue2 * Math.PI) +
          0.1 * normalizedValue * normalizedValue2,
        prediction2D: 0.3 + 
          0.3 * Math.sin(normalizedValue * Math.PI) + 
          0.2 * normalizedValue2 +
          0.1 * Math.sin(normalizedValue2 * Math.PI) +
          0.1 * normalizedValue * normalizedValue2,
      });
    }
  }

  return {
    feature: 'age',
    featureType: 'numeric' as const,
    pdpPoints,
    interactions: {
      feature2: 'income',
      feature2Type: 'numeric' as const,
      pdpPoints2D
    },
    metadata: {
      meanPrediction: 0.5,
      featureRange: [20, 80],
      featureDistribution: Array.from({ length: 20 }, () => Math.random())
    }
  };
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
            checked={values.showInteractions}
            onChange={(e) => onChange({ ...values, showInteractions: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Interactions</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showDistribution}
            onChange={(e) => onChange({ ...values, showDistribution: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Distribution</span>
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

export const PDPVisualizationShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    colorScale: 'blue',
    showInteractions: true,
    showDistribution: true
  });

  const sampleData = generateSampleData();

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (!config.showInteractions) props.push('showInteractions={false}');
    if (!config.showDistribution) props.push('showDistribution={false}');

    return `<PDPVisualization
  data={${JSON.stringify(sampleData, null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Partial Dependence Plot Component
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
                <PDPVisualization
                  data={sampleData}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  showInteractions={config.showInteractions}
                  showDistribution={config.showDistribution}
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

export default PDPVisualizationShowcase;