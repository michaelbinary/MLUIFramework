import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ICEVisualization } from './ICEVisualization';

// Generate sample ICE data
const generateSampleData = (numInstances = 100) => {
  // Generate individual ICE curves
  const curves = Array.from({ length: numInstances }, (_, i) => {
    // Create base instance characteristics
    const baseValue = Math.random() * 50 + 25; // Random age between 25-75
    const income = Math.random() * 100000 + 30000;
    const creditScore = Math.random() * 300 + 500;

    // Generate points along the feature range
    const points = Array.from({ length: 50 }, (_, j) => {
      const value = 20 + (j * 1.2); // Age values from 20 to 80
      const normalizedValue = (value - 20) / 60;
      
      // Create non-linear relationship with some instance-specific variation
      const instanceFactor = Math.random() * 0.4 + 0.8; // Instance-specific multiplier
      const prediction = 
        instanceFactor * (
          0.3 + 
          0.4 * Math.sin(normalizedValue * Math.PI) + 
          0.2 * normalizedValue + 
          0.1 * Math.sin((baseValue / 100) * Math.PI)
        );

      return {
        value,
        prediction
      };
    });

    return {
      instanceId: i + 1,
      points,
      originalValue: baseValue,
      originalPrediction: points.find(p => Math.abs(p.value - baseValue) < 0.1)?.prediction || 0,
      featureValues: {
        income: `$${income.toFixed(0)}`,
        credit_score: creditScore.toFixed(0),
        years_employed: (Math.random() * 20).toFixed(1)
      }
    };
  });

  return {
    feature: 'age',
    featureType: 'numeric' as const,
    curves,
    metadata: {
      meanPrediction: 0.5,
      featureRange: [20, 80],
      featureName: 'Age',
      featureDescription: 'Customer age in years'
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Max Curves
        </label>
        <select
          value={values.maxCurves}
          onChange={(e) => onChange({ ...values, maxCurves: Number(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="20">20 curves</option>
          <option value="50">50 curves</option>
          <option value="100">100 curves</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showCenteredICE}
            onChange={(e) => onChange({ ...values, showCenteredICE: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Centered ICE</span>
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

export const ICEVisualizationShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    colorScale: 'blue',
    maxCurves: 50,
    showCenteredICE: false,
    highlightedInstances: [1, 2, 3]
  });

  const sampleData = generateSampleData();

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (config.maxCurves !== 50) props.push(`maxCurves={${config.maxCurves}}`);
    if (config.showCenteredICE) props.push('showCenteredICE={true}');
    if (config.highlightedInstances.length > 0) props.push(`highlightedInstances={[${config.highlightedInstances.join(', ')}]}`);

    return `<ICEVisualization
  data={${JSON.stringify(sampleData, null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Individual Conditional Expectation Plot Component
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
                <ICEVisualization
                  data={sampleData}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  maxCurves={config.maxCurves}
                  showCenteredICE={config.showCenteredICE}
                  highlightedInstances={config.highlightedInstances}
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

export default ICEVisualizationShowcase;