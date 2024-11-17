import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ROCCurve } from './ROCCurve';

type Quality = 'good' | 'average' | 'poor';
type Theme = 'light' | 'dark';
type Variant = 'default' | 'compact' | 'detailed';
type ColorScale = 'blue' | 'green' | 'purple';

const generateROCData = (quality: Quality) => {
  const points = [];
  const numPoints = 100;

  for (let i = 0; i <= numPoints; i++) {
    const x = i / numPoints;
    let y;

    switch (quality) {
      case 'good':
        y = Math.pow(x, 3);
        break;
      case 'average':
        y = Math.pow(x, 1.5);
        break;
      case 'poor':
        y = x + (Math.random() * 0.1 - 0.05);
        break;
    }

    y = Math.max(0, Math.min(1, y));
    points.push({
      fpr: x,
      tpr: y,
      threshold: 1 - (i / numPoints)
    });
  }

  return points;
};

const SAMPLE_DATA = {
  good: generateROCData('good'),
  average: generateROCData('average'),
  poor: generateROCData('poor')
};

const Controls = ({ values, onChange }: { values: any, onChange: any }) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-neutral-200">
      {/* Theme Control */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Theme</label>
        <select
          value={values.theme}
          onChange={(e) => onChange({ ...values, theme: e.target.value as Theme })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Variant Control */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Variant</label>
        <select
          value={values.variant}
          onChange={(e) => onChange({ ...values, variant: e.target.value as Variant })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      {/* Sample Data Quality Control */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Sample Data</label>
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

      {/* Color Scale Control */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Color Scale</label>
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
    </div>
  );
};

// CodeBlock component for displaying and copying code
const CodeBlock = ({ code, onCopy }: { code: string, onCopy: () => void }) => {
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
        className="absolute top-2 right-2 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

// Function to generate a code snippet based on current config
const generateCode = () => {
  return `<ROCCurve
  data={SAMPLE_DATA}
  theme="light"
  variant="default"
  colorScale="blue"
  showGrid={true}
  showThresholds={false}
  showArea={false}
/>`;
};

export const ROCCurveShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light' as Theme,
    variant: 'default' as Variant,
    dataQuality: 'good',
    colorScale: 'blue',
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900">ROC Curve Component</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1">
            <Controls values={config} onChange={setConfig} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'preview' ? (
              <div className={config.theme === 'dark' ? 'bg-neutral-900 p-6 rounded-lg' : 'bg-neutral-50 p-6 rounded-lg'}>
                <ROCCurve
                  data={SAMPLE_DATA[config.dataQuality as keyof typeof SAMPLE_DATA]}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as ColorScale}
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

export default ROCCurveShowcase;
