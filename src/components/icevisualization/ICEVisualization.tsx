// @ts-nocheck

// src/components/icevisualization/ICEVisualization.tsx


import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  GitBranch,
  Download,
  Filter,
  Info,

  LineChart as LineChartIcon
} from 'lucide-react';

interface ICECurve {
  instanceId: string | number;
  points: Array<{
    value: number;
    prediction: number;
  }>;
  originalValue: number;
  originalPrediction: number;
  featureValues: Record<string, number | string>;
}

interface ICEData {
  feature: string;
  featureType: 'numeric' | 'categorical';
  curves: ICECurve[];
  metadata: {
    meanPrediction: number;
    featureRange: [number, number];
    featureName: string;
    featureDescription?: string;
  };
}

interface ICEVisualizationProps {
  data: ICEData;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'blue' | 'green' | 'purple';
  maxCurves?: number;
  showCenteredICE?: boolean;
  highlightedInstances?: Array<string | number>;
}

const colors = {
  blue: {
    primary: '#3B82F6',
    secondary: '#93C5FD',
    accent: '#2563EB',
    muted: '#DBEAFE',
    background: '#EFF6FF',
    highlight: '#1D4ED8'
  },
  green: {
    primary: '#10B981',
    secondary: '#6EE7B7',
    accent: '#059669',
    muted: '#D1FAE5',
    background: '#ECFDF5',
    highlight: '#047857'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#C4B5FD',
    accent: '#7C3AED',
    muted: '#EDE9FE',
    background: '#F5F3FF',
    highlight: '#6D28D9'
  }
};

export const ICEVisualization: React.FC<ICEVisualizationProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  colorScale = 'blue',
  maxCurves = 50,
  showCenteredICE = false,
  highlightedInstances = []
}) => {
  const isDark = theme === 'dark';
  const colorPalette = colors[colorScale];
  
  const [selectedInstance, setSelectedInstance] = useState<string | number | null>(null);

  const processedData = useMemo(() => {
    // Sample curves if there are too many
    let selectedCurves = data.curves;
    if (data.curves.length > maxCurves) {
      const step = Math.floor(data.curves.length / maxCurves);
      selectedCurves = data.curves.filter((_, i) => i % step === 0).slice(0, maxCurves);
    }

    // Add highlighted instances if they're not already included
    highlightedInstances.forEach(id => {
      const highlightedCurve = data.curves.find(c => c.instanceId === id);
      if (highlightedCurve && !selectedCurves.includes(highlightedCurve)) {
        selectedCurves = [...selectedCurves, highlightedCurve];
      }
    });

    // Process curves for centered ICE if needed
    if (showCenteredICE) {
      selectedCurves = selectedCurves.map(curve => ({
        ...curve,
        points: curve.points.map(point => ({
          ...point,
          prediction: point.prediction - curve.points[0].prediction
        }))
      }));
    }

    return selectedCurves;
  }, [data, maxCurves, showCenteredICE, highlightedInstances]);

  const renderICEPlot = () => {
    // Flatten points for the line chart
    const chartData = processedData[0].points.map((_, pointIndex) => {
      const obj: any = {
        value: processedData[0].points[pointIndex].value
      };
      processedData.forEach(curve => {
        obj[`instance_${curve.instanceId}`] = curve.points[pointIndex].prediction;
      });
      return obj;
    });

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="value"
              label={{ 
                value: data.metadata.featureName,
                position: 'bottom',
                fill: isDark ? '#9CA3AF' : '#6B7280'
              }}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis
              label={{
                value: showCenteredICE ? 'Centered Prediction' : 'Prediction',
                angle: -90,
                position: 'insideLeft',
                fill: isDark ? '#9CA3AF' : '#6B7280'
              }}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                return (
                  <div className={`p-3 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white'
                  }`}>
                    <div className="font-medium">
                      {data.metadata.featureName}: {label}
                    </div>
                    <div className="mt-1 space-y-1">
                      {payload.map((entry: any, index: number) => {
                        const instanceId = entry.dataKey.split('_')[1];
                        const curve = processedData.find(c => c.instanceId.toString() === instanceId);
                        const isHighlighted = highlightedInstances.includes(instanceId);
                        
                        return (
                          <div 
                            key={index}
                            className={`text-sm flex items-center gap-2 ${
                              isHighlighted ? 'font-medium' : ''
                            }`}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: isHighlighted ? 
                                  colorPalette.highlight : 
                                  colorPalette.primary 
                              }}
                            />
                            <span>Instance {instanceId}: {entry.value.toFixed(4)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />
            {processedData.map(curve => (
              <Line
                key={curve.instanceId}
                type="monotone"
                dataKey={`instance_${curve.instanceId}`}
                stroke={
                  highlightedInstances.includes(curve.instanceId) ?
                    colorPalette.highlight :
                    colorPalette.primary
                }
                strokeWidth={
                  highlightedInstances.includes(curve.instanceId) ? 2 : 1
                }
                opacity={
                  selectedInstance === null || 
                  selectedInstance === curve.instanceId ? 1 : 0.1
                }
                dot={false}
                onMouseEnter={() => setSelectedInstance(curve.instanceId)}
                onMouseLeave={() => setSelectedInstance(null)}
              />
            ))}
            {!showCenteredICE && (
              <ReferenceLine
                y={data.metadata.meanPrediction}
                stroke={colorPalette.neutral}
                strokeDasharray="3 3"
                label={{
                  value: 'Mean Prediction',
                  fill: isDark ? '#9CA3AF' : '#6B7280',
                  position: 'right'
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderInstanceDetails = () => {
    if (!selectedInstance) return null;

    const selectedCurve = processedData.find(c => c.instanceId === selectedInstance);
    if (!selectedCurve) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h4 className="text-sm font-medium mb-2">Instance {selectedInstance} Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Original Value</div>
            <div className="font-mono">{selectedCurve.originalValue}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Original Prediction</div>
            <div className="font-mono">
              {selectedCurve.originalPrediction.toFixed(4)}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-sm text-gray-500 mb-1">Feature Values</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(selectedCurve.featureValues).map(([key, value]) => (
              <div key={key} className="text-sm">
                {key}: <span className="font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border ${
        isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          <h3 className="text-base font-medium mb-4">
            ICE Plot: {data.metadata.featureName}
          </h3>
          {renderICEPlot()}
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
            <GitBranch className="h-5 w-5" />
            Individual Conditional Expectation Plot
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">
              Feature: {data.metadata.featureName}
            </h4>
            {data.metadata.featureDescription && (
              <div className="text-sm text-gray-500">
                {data.metadata.featureDescription}
              </div>
            )}
          </div>
          {renderICEPlot()}
        </div>

        {/* Instance Details */}
        {renderInstanceDetails()}

        {/* Info Footer */}
        <div className={`
          flex items-start gap-2 text-sm rounded-lg p-3
          ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
        `}>
          <Info className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            ICE plots show how the model's predictions change for individual instances
            as we vary {data.metadata.featureName}.
            {showCenteredICE && ' Values are centered at the instance\'s original prediction.'}
            Hover over lines to see instance details.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICEVisualization;