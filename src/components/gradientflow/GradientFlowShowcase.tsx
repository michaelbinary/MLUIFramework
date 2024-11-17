// @ts-nocheck

// src/components/gradientflow/GradientFlowShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GradientFlow } from './GradientFlow';

// Generate sample gradient data
const generateGradientData = (
  pattern: 'healthy' | 'vanishing' | 'exploding' | 'oscillating',
  numLayers: number
) => {
  const data = [];
  const layerTypes = ['Conv', 'BatchNorm', 'ReLU', 'Dense'];

  for (let i = 0; i < numLayers; i++) {
    let mean, std;
    const layerType = layerTypes[i % layerTypes.length];
    const noise = () => (Math.random() - 0.5) * 0.1;

    switch (pattern) {
      case 'vanishing':
        mean = 1 * Math.exp(-i * 0.5) + noise();
        std = 0.1 * Math.exp(-i * 0.3) + noise();
        break;
      case 'exploding':
        mean = 0.1 * Math.exp(i * 0.3) + noise();
        std = 0.05 * Math.exp(i * 0.2) + noise();
        break;
      case 'oscillating':
        mean = Math.sin(i * 0.5) + noise();
        std = 0.2 + Math.abs(noise());
        break;
      default: // healthy
        mean = 0.5 + noise();
        std = 0.2 + Math.abs(noise());
        break;
    }

    // Generate histogram data
    const histogram = Array(20).fill(0).map(() => 
      Math.abs(Math.random() * std + mean)
    );

    // Calculate percentiles
    const sortedHist = [...histogram].sort((a, b) => a - b);
    const p25 = sortedHist[Math.floor(sortedHist.length * 0.25)];
    const p50 = sortedHist[Math.floor(sortedHist.length * 0.5)];
    const p75 = sortedHist[Math.floor(sortedHist.length * 0.75)];

    data.push({
      layerName: `${layerType}_${i + 1}`,
      mean,
      std,
      min: Math.min(...histogram),
      max: Math.max(...histogram),
      percentiles: { p25, p50, p75 },
      histogram,
      zeroGradientPercent: pattern === 'vanishing' ? 0.1 * Math.exp(i * 0.2) : 0.01
    });
  }

  return data;
};

const SAMPLE_DATA = {
  healthy: generateGradientData('healthy', 12),
  vanishing: generateGradientData('vanishing', 12),
  exploding: generateGradientData('exploding', 12),
  oscillating: generateGradientData('oscillating', 12)
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
          Gradient Pattern
        </label>
        <select
          value={values.pattern}
          onChange={(e) => onChange({ ...values, pattern: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="healthy">Healthy Gradients</option>
          <option value="vanishing">Vanishing Gradients</option>
          <option value="exploding">Exploding Gradients</option>
          <option value="oscillating">Oscillating Gradients</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Visualization
        </label>
        <select
          value={values.visualization}
          onChange={(e) => onChange({ ...values, visualization: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="area">Area Chart</option>
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
            checked={values.showHistograms}
            onChange={(e) => onChange({ ...values, showHistograms: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Histograms</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showPercentiles}
            onChange={(e) => onChange({ ...values, showPercentiles: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Percentiles</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.highlightProblematic}
            onChange={(e) => onChange({ ...values, highlightProblematic: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Highlight Issues</span>
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

export const GradientFlowShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    pattern: 'healthy',
    visualization: 'line',
    colorScale: 'blue',
    showHistograms: false,
    showPercentiles: true,
    highlightProblematic: true
  });

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.visualization !== 'line') props.push(`visualization="${config.visualization}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (config.showHistograms) props.push('showHistograms={true}');
    if (!config.showPercentiles) props.push('showPercentiles={false}');
    if (!config.highlightProblematic) props.push('highlightProblematic={false}');

    return `<GradientFlow
  data={${JSON.stringify(SAMPLE_DATA['healthy'].slice(0, 3), null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Gradient Flow Component
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
                <GradientFlow
                  data={SAMPLE_DATA[config.pattern as keyof typeof SAMPLE_DATA]}
                  theme={config.theme}
                  variant={config.variant}
                  visualization={config.visualization as 'line' | 'bar' | 'area'}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  showHistograms={config.showHistograms}
                  showPercentiles={config.showPercentiles}
                  highlightProblematic={config.highlightProblematic}
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

export default GradientFlowShowcase;