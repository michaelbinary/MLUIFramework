import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Bar,
  BarChart,
  ReferenceLine,
  Cell,
  ComposedChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  ArrowRight,
  Download,
  Filter,
  Info,
  Grid,
  Box
} from 'lucide-react';

interface PDPPoint {
  value: number;
  prediction: number;
  frequency?: number;
}

interface PDPInteractionPoint {
  value: number;
  value2: number;
  prediction2D: number;
}

interface PDPData {
  feature: string;
  featureType: 'numeric' | 'categorical';
  pdpPoints: PDPPoint[];
  interactions?: {
    feature2: string;
    feature2Type: 'numeric' | 'categorical';
    pdpPoints2D: PDPInteractionPoint[];
  };
  metadata: {
    meanPrediction: number;
    featureRange: [number, number];
  };
}

interface PDPVisualizationProps {
  data: PDPData;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'blue' | 'green' | 'purple';
  showInteractions?: boolean;
  showDistribution?: boolean;
}

const colors = {
  blue: {
    primary: '#3B82F6',
    secondary: '#93C5FD',
    accent: '#2563EB',
    muted: '#DBEAFE',
    background: '#EFF6FF',
    neutral: '#6B7280'
  },
  green: {
    primary: '#10B981',
    secondary: '#6EE7B7',
    accent: '#059669',
    muted: '#D1FAE5',
    background: '#ECFDF5',
    neutral: '#6B7280'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#C4B5FD',
    accent: '#7C3AED',
    muted: '#EDE9FE',
    background: '#F5F3FF',
    neutral: '#6B7280'
  }
};

export const PDPVisualization: React.FC<PDPVisualizationProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  colorScale = 'blue',
  showInteractions = true,
  showDistribution = true
}) => {
  const isDark = theme === 'dark';
  const colorPalette = colors[colorScale];

  const renderMainPDP = () => {
    const chartData = data.pdpPoints.map(point => ({
      value: point.value,
      prediction: point.prediction,
      frequency: point.frequency || 0
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="value"
              label={{ 
                value: data.feature,
                position: 'bottom',
                fill: isDark ? '#9CA3AF' : '#6B7280'
              }}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Predicted Impact',
                angle: -90,
                position: 'insideLeft',
                fill: isDark ? '#9CA3AF' : '#6B7280'
              }}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            {showDistribution && (
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: 'Frequency',
                  angle: 90,
                  position: 'insideRight',
                  fill: isDark ? '#9CA3AF' : '#6B7280'
                }}
              />
            )}
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const point = payload[0].payload;
                return (
                  <div className={`p-3 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white'
                  }`}>
                    <div className="font-medium">{data.feature}: {point.value}</div>
                    <div className="text-sm space-y-1">
                      <div>Prediction: {point.prediction.toFixed(4)}</div>
                      {showDistribution && (
                        <div>Frequency: {(point.frequency * 100).toFixed(1)}%</div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            {showDistribution && (
              <Bar
                yAxisId="right"
                dataKey="frequency"
                fill={colorPalette.muted}
                opacity={0.3}
              />
            )}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="prediction"
              stroke={colorPalette.primary}
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              yAxisId="left"
              y={data.metadata.meanPrediction}
              stroke={colorPalette.neutral}
              strokeDasharray="3 3"
              label={{
                value: 'Mean',
                fill: isDark ? '#9CA3AF' : '#6B7280',
                position: 'right'
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderInteractionPDP = () => {
    if (!data.interactions || !showInteractions) return null;

    const points = data.interactions.pdpPoints2D;
    const minPred = Math.min(...points.map(p => p.prediction2D));
    const maxPred = Math.max(...points.map(p => p.prediction2D));
    
    const getColor = (value: number) => {
      const normalized = (value - minPred) / (maxPred - minPred);
      return isDark 
        ? `rgba(147, 197, 253, ${0.2 + normalized * 0.8})`  // Light blue with varying opacity
        : `rgba(59, 130, 246, ${0.2 + normalized * 0.8})`; // Dark blue with varying opacity
    };

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="value"
              name={data.feature}
              domain={['auto', 'auto']}
            />
            <YAxis
              type="number"
              dataKey="value2"
              name={data.interactions.feature2}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.[0]) return null;
                const point = payload[0].payload;
                return (
                  <div className={`p-3 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white'
                  }`}>
                    <div className="space-y-1 text-sm">
                      <div>{data.feature}: {point.value}</div>
                      <div>{data.interactions.feature2}: {point.value2}</div>
                      <div>Prediction: {point.prediction2D.toFixed(4)}</div>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              data={points}
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <rect
                    x={cx - 10}
                    y={cy - 10}
                    width={20}
                    height={20}
                    fill={getColor(payload.prediction2D)}
                    style={{ opacity: 0.8 }}
                  />
                );
              }}
            />
          </ScatterChart>
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
          <h3 className="text-base font-medium mb-4">
            Partial Dependence Plot: {data.feature}
          </h3>
          {renderMainPDP()}
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
            <TrendingUp className="h-5 w-5" />
            Partial Dependence Analysis
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
        {/* Main PDP */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            Feature Effect: {data.feature}
          </h4>
          {renderMainPDP()}
        </div>

        {/* Interaction PDP */}
        {showInteractions && data.interactions && (
          <div>
            <h4 className="text-sm font-medium mb-2">
              Interaction with {data.interactions.feature2}
            </h4>
            {renderInteractionPDP()}
          </div>
        )}

        {/* Info Footer */}
        <div className={`
          flex items-start gap-2 text-sm rounded-lg p-3
          ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
        `}>
          <Info className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Partial Dependence Plots show how the model predictions change as we vary 
            {data.feature}, while keeping other features constant.
            {showInteractions && data.interactions && 
              ` The interaction plot shows how this relationship changes across different
              values of ${data.interactions.feature2}.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDPVisualization;