import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ShapVisualization } from './ShapVisualization';

const generateSampleData = (numSamples = 100, numFeatures = 8) => {
  const features = [
    'age', 'income', 'credit_score', 'account_balance',
    'num_transactions', 'years_customer', 'num_products', 'recent_activity'
  ];

  return Array.from({ length: numSamples }, (_, i) => ({
    id: i,
    prediction: Math.random(),
    features: features.reduce((acc, feature) => ({
      ...acc,
      [feature]: Math.random() * 100
    }), {}),
    shapValues: features.map(feature => ({
      feature,
      value: Math.random() * 100,
      baseValue: 50,
      shapValue: (Math.random() - 0.5) * 2,
      interaction: Math.random() > 0.7 ? {
        feature: features[Math.floor(Math.random() * features.length)],
        value: Math.random() - 0.5
      } : undefined
    }))
  }));
};

const Controls = ({ values, onChange }) => (
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
    {/* Other control elements */}
  </div>
);

export const ShapVisualizationShowcase = () => {
  const [config, setConfig] = useState({
    theme: 'light' as 'light' | 'dark',
    variant: 'default' as 'default' | 'compact' | 'detailed',
    colorScale: 'blue' as 'blue' | 'green' | 'purple',
    showInteractions: true,
    maxFeaturesShown: 10,
  });

  const sampleData = generateSampleData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            SHAP Value Visualization Component
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1">
            <Controls values={config} onChange={setConfig} />
          </div>

          <div className="lg:col-span-3">
            <div className={config.theme === 'dark' ? 'bg-neutral-900 p-6 rounded-lg' : 'bg-neutral-50 p-6 rounded-lg'}>
              <ShapVisualization
                data={sampleData}
                theme={config.theme}
                variant={config.variant}
                colorScale={config.colorScale}
                showInteractions={config.showInteractions}
                maxFeaturesShown={config.maxFeaturesShown}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapVisualizationShowcase;
