// @ts-nocheck

// src/components/driftdetector/DriftDetectorShowcase.tsx

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { DriftDetector } from './DriftDetector';

// Generate sample drift data with different patterns
const generateDriftData = (
  pattern: 'sudden' | 'gradual' | 'seasonal' | 'stable',
  numPoints: number = 100
) => {
  const data = [];
  const timeStep = 15 * 60 * 1000; // 15 minutes

  // Generate baseline distribution (normal distribution)
  const baselineDistribution = Array.from({ length: 20 }, (_, i) => {
    const x = (i - 10) / 5;
    return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  });

  for (let i = 0; i < numPoints; i++) {
    let driftAmount;
    const noise = () => (Math.random() - 0.5) * 0.05;

    switch (pattern) {
      case 'sudden':
        driftAmount = i > numPoints * 0.7 ? 0.4 : 0.05;
        break;
      case 'gradual':
        driftAmount = (i / numPoints) * 0.4;
        break;
      case 'seasonal':
        driftAmount = 0.2 * Math.sin(2 * Math.PI * i / (numPoints / 2)) + 0.1;
        break;
      default: // stable
        driftAmount = 0.05;
    }

    // Generate current distribution with drift
    const currentDistribution = baselineDistribution.map(value => 
      value * (1 + driftAmount + noise())
    );

    const ksDrift = driftAmount + noise();
    const psi = driftAmount * 1.2 + noise();
    const jsDivergence = driftAmount * 0.8 + noise();

    let driftStatus: 'none' | 'low' | 'medium' | 'high';
    if (ksDrift > 0.3) driftStatus = 'high';
    else if (ksDrift > 0.2) driftStatus = 'medium';
    else if (ksDrift > 0.1) driftStatus = 'low';
    else driftStatus = 'none';

    const alerts = [];
    if (ksDrift > 0.3) {
      alerts.push({
        type: 'drift',
        severity: 'high',
        message: 'Significant distribution shift detected in the feature values.'
      });
    }
    if (driftAmount > 0.25) {
      alerts.push({
        type: 'anomaly',
        severity: 'medium',
        message: 'Unusual pattern detected in the recent data points.'
      });
    }

    data.push({
      timestamp: Date.now() - (numPoints - i) * timeStep,
      featureName: 'feature_1',
      baselineStats: {
        mean: 0,
        std: 1,
        min: -3,
        max: 3,
        distribution: baselineDistribution
      },
      currentStats: {
        mean: driftAmount,
        std: 1 + driftAmount * 0.2,
        min: -3 - driftAmount,
        max: 3 + driftAmount,
        distribution: currentDistribution
      },
      driftMetrics: {
        ksDrift,
        psi,
        jsDivergence
      },
      driftStatus,
      alerts
    });
  }

  return data;
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
          Drift Pattern
        </label>
        <select
          value={values.pattern}
          onChange={(e) => onChange({ ...values, pattern: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="stable">Stable</option>
          <option value="sudden">Sudden Drift</option>
          <option value="gradual">Gradual Drift</option>
          <option value="seasonal">Seasonal Pattern</option>
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
          Monitoring Window (hours)
        </label>
        <select
          value={values.monitoringWindow}
          onChange={(e) => onChange({ ...values, monitoringWindow: parseInt(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="1">1 hour</option>
          <option value="6">6 hours</option>
          <option value="12">12 hours</option>
          <option value="24">24 hours</option>
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
            checked={values.showAlerts}
            onChange={(e) => onChange({ ...values, showAlerts: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Alerts</span>
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

export const DriftDetectorShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    pattern: 'stable',
    colorScale: 'blue',
    monitoringWindow: 24,
    showDistributions: true,
    showAlerts: true
  });

  const [data, setData] = useState(generateDriftData(config.pattern as any));

  // Update data when pattern changes
  useEffect(() => {
    setData(generateDriftData(config.pattern as any));
  }, [config.pattern]);

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (config.monitoringWindow !== 24) props.push(`monitoringWindow={${config.monitoringWindow}}`);
    if (!config.showDistributions) props.push('showDistributions={false}');
    if (!config.showAlerts) props.push('showAlerts={false}');

    return `<DriftDetector
  data={${JSON.stringify(generateDriftData('stable', 2), null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Drift Detector Component
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
                <DriftDetector
                  data={data}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  monitoringWindow={config.monitoringWindow}
                  showDistributions={config.showDistributions}
                  showAlerts={config.showAlerts}
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

export default DriftDetectorShowcase;