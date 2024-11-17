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

  for (let i = -days; i < days / 3; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const trendComponent = trend * i;
    const dayOfWeek = date.getDay();
    const timeOfYear = date.getMonth() * 30 + date.getDate();

    const dailyPattern = Math.sin(date.getHours() * Math.PI / 12) * seasonalityDaily;
    const weeklyPattern = Math.sin(dayOfWeek * Math.PI / 3.5) * seasonalityWeekly;
    const yearlyPattern = Math.sin(timeOfYear * Math.PI / 182.5) * 500;

    const deterministicValue = baseValue + trendComponent + dailyPattern + weeklyPattern + yearlyPattern;
    const noise = Math.random() * 100 - 50;
    const actual = deterministicValue + noise;

    const point: any = {
      timestamp: date.getTime(),
      actual: i < 0 ? actual : undefined,
      trend: deterministicValue,
      forecast: i >= 0 ? actual : undefined,
      lower: i >= 0 ? actual - 100 - Math.abs(i * 2) : undefined,
      upper: i >= 0 ? actual + 100 + Math.abs(i * 2) : undefined,
      anomaly: i < 0 && Math.random() < 0.05 ? true : undefined,
    };

    data.push(point);
  }

  return {
    name: 'Energy Consumption',
    data,
    metrics: {
      mape: 8.5,
      rmse: 156.3,
      mae: 124.7,
      r2: 0.89,
    },
    anomalyThreshold: 2.0,
  };
};

const Controls = ({ values, onChange }) => (
  <div className="controls">
    {/* Control elements */}
    <select
      value={values.theme}
      onChange={(e) => onChange({ ...values, theme: e.target.value as 'light' | 'dark' })}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
    {/* Additional controls */}
  </div>
);

export const TimeSeriesVisualizationShowcase = () => {
  const [config, setConfig] = useState({
    theme: 'light' as 'light' | 'dark',
    variant: 'default' as 'default' | 'compact' | 'detailed',
    colorScale: 'blue' as 'blue' | 'green' | 'purple',
    showConfidenceIntervals: true,
  });

  const sampleData = generateSampleData();

  return (
    <div className="showcase">
      <Controls values={config} onChange={setConfig} />
      <TimeSeriesVisualization
        data={sampleData}
        theme={config.theme}
        variant={config.variant}
        colorScale={config.colorScale}
        showConfidenceIntervals={config.showConfidenceIntervals}
      />
    </div>
  );
};

export default TimeSeriesVisualizationShowcase;
