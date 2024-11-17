// @ts-nocheck

import { useState } from 'react';
import { LayerActivations } from './LayerActivations';

// Generate sample data - just a 4x4 matrix for preview
const generateSampleData = (type: 'conv2d' | 'attention' | 'dense') => {
  const baseMatrix = [
    [0.9, 0.3, 0.5, 0.8],
    [0.4, 0.7, 0.2, 0.6],
    [0.6, 0.1, 0.8, 0.3],
    [0.2, 0.9, 0.4, 0.7]
  ];

  const data = {
    conv2d: [{
      layerName: 'Conv2D_1',
      activations: baseMatrix,
      channelNames: Array(4).fill(0).map((_, i) => `Filter ${i + 1}`),
      stats: { min: 0.1, max: 0.9, mean: 0.5, std: 0.2 }
    }],
    attention: [{
      layerName: 'Attention_1',
      activations: baseMatrix,
      channelNames: Array(4).fill(0).map((_, i) => `Head ${i + 1}`),
      stats: { min: 0.1, max: 0.9, mean: 0.5, std: 0.2 }
    }],
    dense: [{
      layerName: 'Dense_1',
      activations: baseMatrix,
      channelNames: Array(4).fill(0).map((_, i) => `Neuron ${i + 1}`),
      stats: { min: 0.1, max: 0.9, mean: 0.5, std: 0.2 }
    }]
  };

  return data[type];
};

const Controls = ({ values, onChange }) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-neutral-200">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Theme</label>
        <select
          value={values.theme}
          onChange={(e) => onChange({ ...values, theme: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Variant</label>
        <select
          value={values.variant}
          onChange={(e) => onChange({ ...values, variant: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md"
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Layer Type</label>
        <select
          value={values.layerType}
          onChange={(e) => onChange({ ...values, layerType: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md"
        >
          <option value="conv2d">Convolutional Layer</option>
          <option value="attention">Attention Layer</option>
          <option value="dense">Dense Layer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Color Scale</label>
        <select
          value={values.colorScale}
          onChange={(e) => onChange({ ...values, colorScale: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md"
        >
          <option value="viridis">Viridis</option>
          <option value="magma">Magma</option>
          <option value="plasma">Plasma</option>
          <option value="inferno">Inferno</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showChannelNames}
            onChange={(e) => onChange({ ...values, showChannelNames: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Channel Names</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showStats}
            onChange={(e) => onChange({ ...values, showStats: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Statistics</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.interactive}
            onChange={(e) => onChange({ ...values, interactive: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Interactive Mode</span>
        </label>
      </div>
    </div>
  );
};

export const LayerActivationsShowcase = () => {
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    layerType: 'conv2d',
    colorScale: 'viridis',
    showChannelNames: true,
    showStats: true,
    interactive: true
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900">Layer Activations Component</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1">
            <Controls values={config} onChange={setConfig} />
          </div>

          <div className="lg:col-span-3">
            <div className={config.theme === 'dark' ? 'bg-neutral-900 p-6 rounded-lg' : 'bg-neutral-50 p-6 rounded-lg'}>
              <LayerActivations
                data={generateSampleData(config.layerType as 'conv2d' | 'attention' | 'dense')}
                theme={config.theme}
                variant={config.variant}
                colorScale={config.colorScale as 'viridis' | 'magma' | 'plasma' | 'inferno'}
                showChannelNames={config.showChannelNames}
                showStats={config.showStats}
                interactive={config.interactive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerActivationsShowcase;