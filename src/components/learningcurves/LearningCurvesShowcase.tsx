// src/components/learningcurves/LearningCurvesShowcase.tsx

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { LearningCurves } from './LearningCurves';

// Generate sample learning curve data
const generateLearningData = (
  pattern: 'good' | 'overfitting' | 'underfitting' | 'unstable',
  epochs: number
) => {
  const data = [];
  
  for (let i = 0; i < epochs; i++) {
    let trainValue, valValue;
    const noise = () => (Math.random() - 0.5) * 0.1;
    
    switch (pattern) {
      case 'good':
        trainValue = 1 - 0.8 * Math.exp(-i / 20) + noise() * 0.2;
        valValue = 1 - 0.75 * Math.exp(-i / 20) + noise() * 0.2;
        break;
      
      case 'overfitting':
        trainValue = 1 - 0.9 * Math.exp(-i / 15) + noise() * 0.1;
        valValue = 0.8 - 0.4 * Math.exp(-i / 15) - (i / epochs) * 0.3 + noise() * 0.1;
        break;
      
      case 'underfitting':
        trainValue = 0.7 - 0.3 * Math.exp(-i / 30) + noise() * 0.1;
        valValue = 0.65 - 0.25 * Math.exp(-i / 30) + noise() * 0.1;
        break;
      
      case 'unstable':
        trainValue = 0.8 - 0.4 * Math.exp(-i / 20) + noise() + Math.sin(i / 5) * 0.1;
        valValue = 0.75 - 0.35 * Math.exp(-i / 20) + noise() + Math.sin(i / 5) * 0.1;
        break;
    }

    // Add confidence intervals
    const confidence = 0.1 * Math.exp(-i / 50);
    
    data.push({
      name: i,
      train: trainValue,
      validation: valValue,
      confidenceLow: valValue - confidence,
      confidenceHigh: valValue + confidence
    });
  }

  return data;
};

const SAMPLE_DATA = {
  good: generateLearningData('good', 100),
  overfitting: generateLearningData('overfitting', 100),
  underfitting: generateLearningData('underfitting', 100),
  unstable: generateLearningData('unstable', 100)
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
          Learning Pattern
        </label>
        <select
          value={values.pattern}
          onChange={(e) => onChange({ ...values, pattern: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="good">Good Convergence</option>
          <option value="overfitting">Overfitting</option>
          <option value="underfitting">Underfitting</option>
          <option value="unstable">Unstable Training</option>
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
          Smoothing Factor
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={values.smoothing}
          onChange={(e) => onChange({ ...values, smoothing: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-neutral-500 mt-1">
          Value: {values.smoothing}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showConfidence}
            onChange={(e) => onChange({ ...values, showConfidence: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Confidence Intervals</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showBrush}
            onChange={(e) => onChange({ ...values, showBrush: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Brush</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.autoScale}
            onChange={(e) => onChange({ ...values, autoScale: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Auto Scale</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.realTime}
            onChange={(e) => onChange({ ...values, realTime: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Real-time Updates</span>
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

export const LearningCurvesShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    pattern: 'good',
    colorScale: 'blue',
    smoothing: 0,
    showConfidence: true,
    showBrush: false,
    autoScale: true,
    realTime: false
  });

  const [liveData, setLiveData] = useState(SAMPLE_DATA[config.pattern as keyof typeof SAMPLE_DATA]);

  // Simulate real-time updates
  useEffect(() => {
    if (!config.realTime) {
      setLiveData(SAMPLE_DATA[config.pattern as keyof typeof SAMPLE_DATA]);
      return;
    }

    const interval = setInterval(() => {
      setLiveData(current => {
        const lastEpoch = current[current.length - 1].name;
        const newData = generateLearningData(config.pattern as 'good' | 'overfitting' | 'underfitting' | 'unstable', 1)[0];
        newData.name = lastEpoch + 1;
        return [...current.slice(-99), newData];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.realTime, config.pattern]);

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (config.smoothing !== 0) props.push(`smoothing={${config.smoothing}}`);
    if (!config.showConfidence) props.push('showConfidence={false}');
    if (config.showBrush) props.push('showBrush={true}');
    if (!config.autoScale) props.push('autoScale={false}');
    if (config.realTime) props.push('realTime={true}');

    return `<LearningCurves
  data={[
    { name: 0, train: 0.8, validation: 0.75, confidenceLow: 0.7, confidenceHigh: 0.8 },
    { name: 1, train: 0.85, validation: 0.78, confidenceLow: 0.73, confidenceHigh: 0.83 },
    // ... more epochs
  ]}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Learning Curves Component
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
                <LearningCurves
                  data={liveData}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  smoothing={config.smoothing}
                  showConfidence={config.showConfidence}
                  showBrush={config.showBrush}
                  autoScale={config.autoScale}
                  realTime={config.realTime}
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

export default LearningCurvesShowcase;