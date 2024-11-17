import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { TimeSeriesVisualization } from './TimeSeriesVisualization';

// Generate sample time series data
const generateSampleData = (days = 180) => {
  const now = new Date();
  const data = [];
  const baseValue = 1000;
  const trend = 0.5;
  const seasonalityDaily = 100;
  const seasonalityWeekly = 200;
  
  // Generate historical data and forecasts
  for (let i = -days; i < days/3; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const trendComponent = trend * i;
    const dayOfWeek = date.getDay();
    const timeOfYear = date.getMonth() * 30 + date.getDate();
    
    // Add multiple seasonal patterns
    const dailyPattern = Math.sin(date.getHours() * Math.PI / 12) * seasonalityDaily;
    const weeklyPattern = Math.sin(dayOfWeek * Math.PI / 3.5) * seasonalityWeekly;
    const yearlyPattern = Math.sin(timeOfYear * Math.PI / 182.5) * 500;

    const deterministicValue = baseValue + trendComponent + dailyPattern + weeklyPattern + yearlyPattern;
    const noise = Math.random() * 100 - 50;
    const actual = deterministicValue + noise;

    // Add forecasts for future dates
    const point: any = {
      timestamp: date.getTime(),
      actual: i < 0 ? actual : undefined,
      trend: deterministicValue
    };

    if (i >= 0) {
      point.forecast = actual;
      point.lower = actual - 100 - Math.abs(i * 2);
      point.upper = actual + 100 + Math.abs(i * 2);
    }

    // Add some anomalies
    if (i < 0 && Math.random() < 0.05) {
      point.actual *= (Math.random() > 0.5 ? 1.5 : 0.5);
      point.anomaly = true;
      point.anomalyScore = Math.abs((point.actual - deterministicValue) / deterministicValue);
    }

    data.push(point);
  }

  // Calculate seasonality patterns
  const weeklySeasonality = Array.from({ length: 7 }, (_, i) => ({
    offset: i,
    value: Math.sin(i * Math.PI / 3.5) * seasonalityWeekly
  }));

  const dailySeasonality = Array.from({ length: 24 }, (_, i) => ({
    offset: i,
    value: Math.sin(i * Math.PI / 12) * seasonalityDaily
  }));

  return {
    name: 'Energy Consumption',
    description: 'Hourly energy consumption in kWh',
    data,
    seasonality: [
      {
        period: 24,
        strength: 0.7,
        pattern: dailySeasonality
      },
      {
        period: 168,
        strength: 0.8,
        pattern: weeklySeasonality
      }
    ],
    metrics: {
      mape: 8.5,
      rmse: 156.3,
      mae: 124.7,
      r2: 0.89
    },
    anomalyThreshold: 2.0
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
          Forecast Horizon (days)
        </label>
        <select
          value={values.forecastHorizon}
          onChange={(e) => onChange({ ...values, forecastHorizon: Number(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="30">30 days</option>
          <option value="60">60 days</option>
          <option value="90">90 days</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showConfidenceIntervals}
            onChange={(e) => onChange({ ...values, showConfidenceIntervals: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Confidence Intervals</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showSeasonality}
            onChange={(e) => onChange({ ...values, showSeasonality: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Seasonality</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showAnomalies}
            onChange={(e) => onChange({ ...values, showAnomalies: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Anomalies</span>
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

export const TimeSeriesVisualizationShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    colorScale: 'blue',
    forecastHorizon: 30,
    showConfidenceIntervals: true,
    showSeasonality: true,
    showAnomalies: true
  });

  const sampleData = generateSampleData();

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (!config.showConfidenceIntervals) props.push('showConfidenceIntervals={false}');
    if (!config.showSeasonality) props.push('showSeasonality={false}');
    if (!config.showAnomalies) props.push('showAnomalies={false}');
    if (config.forecastHorizon !== 30) props.push(`forecastHorizon={${config.forecastHorizon}}`);

    return `<TimeSeriesVisualization
  data={${JSON.stringify(sampleData, null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Time Series Visualization Component
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
                <TimeSeriesVisualization
                  data={sampleData}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale as 'blue' | 'green' | 'purple'}
                  forecastHorizon={config.forecastHorizon}
                  showConfidenceIntervals={config.showConfidenceIntervals}
                  showSeasonality={config.showSeasonality}
                  showAnomalies={config.showAnomalies}
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

export default TimeSeriesVisualizationShowcase;