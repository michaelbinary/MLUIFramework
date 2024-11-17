// src/components/resourcemonitor/ResourceMonitorShowcase.tsx

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { ResourceMonitor } from './ResourceMonitor';

// Generate sample resource monitoring data
const generateResourceData = (
  pattern: 'normal' | 'gpu-bottleneck' | 'cpu-bottleneck' | 'memory-leak',
  numPoints: number = 100
) => {
  const data = [];
  const timeStep = 1000; // 1 second intervals

  for (let i = 0; i < numPoints; i++) {
    const noise = () => (Math.random() - 0.5) * 10;
    let gpuUtil, gpuMem, cpuUtil, cpuMem, samplesPerSec, batchTime;

    switch (pattern) {
      case 'gpu-bottleneck':
        gpuUtil = Math.min(100, 95 + noise());
        gpuMem = 85 + noise();
        cpuUtil = 40 + noise();
        cpuMem = 50 + noise();
        samplesPerSec = 150 + noise();
        batchTime = 100 + noise();
        break;

      case 'cpu-bottleneck':
        gpuUtil = 60 + noise();
        gpuMem = 50 + noise();
        cpuUtil = Math.min(100, 90 + noise());
        cpuMem = 80 + noise();
        samplesPerSec = 100 + noise();
        batchTime = 150 + noise();
        break;

      case 'memory-leak':
        gpuUtil = 70 + noise();
        gpuMem = Math.min(100, 50 + i * 0.5 + noise());
        cpuUtil = 60 + noise();
        cpuMem = Math.min(100, 40 + i * 0.4 + noise());
        samplesPerSec = Math.max(50, 200 - i * 1 + noise());
        batchTime = Math.min(200, 50 + i * 0.5 + noise());
        break;

      default: // normal
        gpuUtil = 70 + noise();
        gpuMem = 60 + noise();
        cpuUtil = 50 + noise();
        cpuMem = 40 + noise();
        samplesPerSec = 200 + noise();
        batchTime = 50 + noise();
    }

    const bottlenecks = [];
    if (pattern === 'gpu-bottleneck' && gpuUtil > 90) {
      bottlenecks.push({
        type: 'GPU',
        severity: 'high',
        description: 'GPU utilization consistently above 90%. Consider reducing batch size or model complexity.'
      });
    }
    if (pattern === 'cpu-bottleneck' && cpuUtil > 90) {
      bottlenecks.push({
        type: 'CPU',
        severity: 'high',
        description: 'CPU bottleneck detected. Data loading may be limiting training speed.'
      });
    }
    if (pattern === 'memory-leak' && (gpuMem > 90 || cpuMem > 90)) {
      bottlenecks.push({
        type: 'Memory',
        severity: 'high',
        description: 'Possible memory leak detected. Memory usage is continuously increasing.'
      });
    }

    data.push({
      timestamp: Date.now() - (numPoints - i) * timeStep,
      gpu: {
        utilization: gpuUtil,
        memory: gpuMem,
        temperature: 65 + noise() / 2,
        powerDraw: 150 + noise()
      },
      cpu: {
        utilization: cpuUtil,
        memory: cpuMem,
        temperature: 55 + noise() / 2
      },
      training: {
        samplesPerSecond: samplesPerSec,
        batchTime: batchTime,
        throughput: samplesPerSec * (batchTime / 100),
        memoryAllocated: (gpuMem / 100) * 16384 // 16GB max memory
      },
      bottlenecks
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
          onChange={(e) => onChange({ ...values, theme: e.target.value as 'light' | 'dark' })}
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
          onChange={(e) => onChange({ ...values, variant: e.target.value as 'default' | 'compact' | 'detailed' })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Resource Pattern
        </label>
        <select
          value={values.pattern}
          onChange={(e) => onChange({ ...values, pattern: e.target.value as 'normal' | 'gpu-bottleneck' | 'cpu-bottleneck' | 'memory-leak' })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="normal">Normal Training</option>
          <option value="gpu-bottleneck">GPU Bottleneck</option>
          <option value="cpu-bottleneck">CPU Bottleneck</option>
          <option value="memory-leak">Memory Leak</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Color Scale
        </label>
        <select
          value={values.colorScale}
          onChange={(e) => onChange({ ...values, colorScale: e.target.value as 'blue' | 'green' | 'purple' })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Time Window (minutes)
        </label>
        <select
          value={values.timeWindow}
          onChange={(e) => onChange({ ...values, timeWindow: parseInt(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="1">1 minute</option>
          <option value="5">5 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showBottlenecks}
            onChange={(e) => onChange({ ...values, showBottlenecks: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Bottlenecks</span>
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

export const ResourceMonitorShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState<{
    theme: 'light' | 'dark';
    variant: 'default' | 'compact' | 'detailed';
    pattern: 'normal' | 'gpu-bottleneck' | 'cpu-bottleneck' | 'memory-leak';
    colorScale: 'blue' | 'green' | 'purple';
    timeWindow: number;
    showBottlenecks: boolean;
    realTime: boolean;
  }>({
    theme: 'light',
    variant: 'default',
    pattern: 'normal',
    colorScale: 'blue',
    timeWindow: 5,
    showBottlenecks: true,
    realTime: false,
  });

  const [data, setData] = useState(generateResourceData(config.pattern));

  // Simulate real-time updates
  useEffect(() => {
    if (!config.realTime) {
      setData(generateResourceData(config.pattern));
      return;
    }

    const interval = setInterval(() => {
      setData(current => {
        const newPoint = generateResourceData(config.pattern, 1)[0];
        return [...current.slice(1), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.realTime, config.pattern]);

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.colorScale !== 'blue') props.push(`colorScale="${config.colorScale}"`);
    if (config.timeWindow !== 5) props.push(`timeWindow={${config.timeWindow}}`);
    if (!config.showBottlenecks) props.push('showBottlenecks={false}');
    if (config.realTime) props.push('realTime={true}');

    return `<ResourceMonitor
  data={[
    {
      timestamp: Date.now(),
      gpu: {
        utilization: 75.2,
        memory: 8192,
        temperature: 65,
        powerDraw: 150
      },
      cpu: {
        utilization: 45.8,
        memory: 16384,
        temperature: 55
      },
      training: {
        samplesPerSecond: 256,
        batchTime: 45.2,
        throughput: 180.5,
        memoryAllocated: 8192
      }
    }
    // ... more data points
  ]}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Resource Monitor Component
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
                <ResourceMonitor
                  data={data}
                  theme={config.theme}
                  variant={config.variant}
                  colorScale={config.colorScale}
                  timeWindow={config.timeWindow}
                  showBottlenecks={config.showBottlenecks}
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

export default ResourceMonitorShowcase;
