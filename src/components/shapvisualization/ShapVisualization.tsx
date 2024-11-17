import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from 'recharts';
import {
  BrainCircuit,
  Download,
  Filter,
  Info,

} from 'lucide-react';

interface ShapValue {
  feature: string;
  value: number;
  baseValue: number;
  shapValue: number;
  interaction?: {
    feature: string;
    value: number;
  };
}

interface Sample {
  id: string | number;
  prediction: number;
  features: Record<string, number | string>;
  shapValues: ShapValue[];
}

interface ShapVisualizationProps {
  data: Sample[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'blue' | 'green' | 'purple';
  showInteractions?: boolean;
  maxFeaturesShown?: number;
}

const colors = {
  blue: {
    positive: '#3B82F6',
    negative: '#EF4444',
    neutral: '#6B7280',
    background: '#EFF6FF'
  },
  green: {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280',
    background: '#ECFDF5'
  },
  purple: {
    positive: '#8B5CF6',
    negative: '#EF4444',
    neutral: '#6B7280',
    background: '#F5F3FF'
  }
};

export const ShapVisualization: React.FC<ShapVisualizationProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  colorScale = 'blue',
  showInteractions = true,
  maxFeaturesShown = 10
}) => {
  const isDark = theme === 'dark';
  const colorPalette = colors[colorScale];

  const processedData = useMemo(() => {
    // Aggregate SHAP values across all samples
    const aggregatedShap = data.reduce((acc, sample) => {
      sample.shapValues.forEach(shap => {
        if (!acc[shap.feature]) {
          acc[shap.feature] = {
            feature: shap.feature,
            meanAbsShap: 0,
            values: [] as number[],
            featureValues: [] as (number | string)[]
          };
        }
        acc[shap.feature].values.push(shap.shapValue);
        acc[shap.feature].featureValues.push(sample.features[shap.feature]);
      });
      return acc;
    }, {} as Record<string, any>);

    // Calculate mean absolute SHAP value for each feature
    Object.values(aggregatedShap).forEach(feature => {
      feature.meanAbsShap = feature.values.reduce(
        (sum: number, val: number) => sum + Math.abs(val), 0
      ) / feature.values.length;
    });

    // Sort features by importance and limit to maxFeaturesShown
    return Object.values(aggregatedShap)
      .sort((a, b) => b.meanAbsShap - a.meanAbsShap)
      .slice(0, maxFeaturesShown);
  }, [data, maxFeaturesShown]);

  const renderWaterfallPlot = (sample: Sample) => {
    const waterfallData = sample.shapValues
      .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue))
      .slice(0, maxFeaturesShown)
      .map(shap => ({
        feature: shap.feature,
        impact: shap.shapValue,
        value: shap.value
      }));

    return (
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={['dataMin', 'dataMax']} />
            <YAxis type="category" dataKey="feature" width={120} />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className={`p-2 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white'
                  }`}>
                    <div className="font-medium">{data.feature}</div>
                    <div className="text-sm">
                      <div>Value: {data.value}</div>
                      <div>Impact: {data.impact.toFixed(4)}</div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="impact"
              fill={colorPalette.positive}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderFeatureImportancePlot = () => {
    return (
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="feature" width={120} />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className={`p-2 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white'
                  }`}>
                    <div className="font-medium">{data.feature}</div>
                    <div className="text-sm">
                      Mean |SHAP|: {data.meanAbsShap.toFixed(4)}
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="meanAbsShap"
              fill={colorPalette.positive}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border ${
        isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          <h3 className="text-base font-medium mb-4">Feature Importance (SHAP)</h3>
          {renderFeatureImportancePlot()}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${
      isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            SHAP Value Analysis
          </h3>
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded-md hover:bg-gray-100 ${
              isDark ? 'hover:bg-gray-800' : ''
            }`}>
              <Download className="h-4 w-4" />
            </button>
            <button className={`p-1.5 rounded-md hover:bg-gray-100 ${
              isDark ? 'hover:bg-gray-800' : ''
            }`}>
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Global Feature Importance */}
        <div>
          <h4 className="text-sm font-medium mb-2">Global Feature Importance</h4>
          {renderFeatureImportancePlot()}
        </div>

        {/* Sample-level Explanation */}
        <div>
          <h4 className="text-sm font-medium mb-2">Sample Explanation</h4>
          {renderWaterfallPlot(data[0])}
        </div>

        {/* Info Footer */}
        <div className={`
          flex items-start gap-2 text-sm rounded-lg p-3
          ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
        `}>
          <Info className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            SHAP (SHapley Additive exPlanations) values show the contribution of each feature
            to the prediction. Positive values push the prediction higher, while negative
            values push it lower.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapVisualization;