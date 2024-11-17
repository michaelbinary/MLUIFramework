// @ts-nocheck

// src/components/gradientflow/GradientFlow.tsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { TrendingDown, Download, Filter, Info, RefreshCcw } from 'lucide-react';

interface LayerGradient {
  layerName: string;
  mean: number;
  std: number;
  min: number;
  max: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
  };
  histogram?: number[];
  zeroGradientPercent?: number;
}

interface GradientFlowProps {
  data: LayerGradient[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showHistograms?: boolean;
  showPercentiles?: boolean;
  visualization?: 'line' | 'bar' | 'area';
  colorScale?: 'blue' | 'green' | 'purple';
  highlightProblematic?: boolean;
}

const formatNumber = (value: number): string => {
  if (Math.abs(value) < 0.001) return value.toExponential(2);
  return value.toFixed(4);
};

const getStatusColor = (meanGradient: number, stdGradient: number): string => {
  if (Math.abs(meanGradient) < 0.0001) return 'text-rose-500'; // Vanishing gradient
  if (Math.abs(meanGradient) > 10) return 'text-amber-500'; // Exploding gradient
  return 'text-emerald-500'; // Healthy gradient
};

export const GradientFlow: React.FC<GradientFlowProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  showHistograms = false,
  showPercentiles = true,
  visualization = 'line',
  colorScale = 'blue',
  highlightProblematic = true
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const colors = {
    blue: {
      main: '#3B82F6',
      light: '#93C5FD',
      area: '#3B82F620'
    },
    green: {
      main: '#10B981',
      light: '#6EE7B7',
      area: '#10B98120'
    },
    purple: {
      main: '#8B5CF6',
      light: '#C4B5FD',
      area: '#8B5CF620'
    }
  };

  const selectedColors = colors[colorScale];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const layer = payload[0].payload;
    return (
      <div className={`
        p-3 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <div className="space-y-2">
          <div className="font-medium">{layer.layerName}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>Mean: {formatNumber(layer.mean)}</div>
            <div>Std: {formatNumber(layer.std)}</div>
            <div>Min: {formatNumber(layer.min)}</div>
            <div>Max: {formatNumber(layer.max)}</div>
            {layer.zeroGradientPercent !== undefined && (
              <div className="col-span-2">
                Zero Gradients: {(layer.zeroGradientPercent * 100).toFixed(1)}%
              </div>
            )}
          </div>
          {showPercentiles && (
            <div className="text-sm text-neutral-500">
              Percentiles: {formatNumber(layer.percentiles.p25)} / {formatNumber(layer.percentiles.p50)} / {formatNumber(layer.percentiles.p75)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistogram = (values: number[], layerName: string) => {
    return (
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={values.map((value, idx) => ({ bin: idx, value }))}>
            <Bar
              dataKey="value"
              fill={selectedColors.main}
              opacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderGradientChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 20, left: 20, bottom: 20 }
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        {visualization === 'area' ? (
          <ComposedChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#525252' : '#E5E7EB'}
            />
            <XAxis 
              dataKey="layerName"
              angle={-45}
              textAnchor="end"
              height={100}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mean"
              fill={selectedColors.area}
              stroke={selectedColors.main}
              strokeWidth={2}
            />
            {showPercentiles && (
              <>
                <Line
                  type="monotone"
                  dataKey="percentiles.p75"
                  stroke={selectedColors.light}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="percentiles.p25"
                  stroke={selectedColors.light}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        ) : visualization === 'bar' ? (
          <ComposedChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#525252' : '#E5E7EB'}
            />
            <XAxis 
              dataKey="layerName"
              angle={-45}
              textAnchor="end"
              height={100}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="mean"
              fill={selectedColors.main}
              opacity={0.8}
            />
            {showPercentiles && (
              <Bar
                dataKey="std"
                fill={selectedColors.light}
                opacity={0.5}
              />
            )}
          </ComposedChart>
        ) : (
          <LineChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#525252' : '#E5E7EB'}
            />
            <XAxis 
              dataKey="layerName"
              angle={-45}
              textAnchor="end"
              height={100}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mean"
              stroke={selectedColors.main}
              strokeWidth={2}
              dot={highlightProblematic ? {
                fill: selectedColors.main,
                strokeWidth: 2,
                r: (point: any) => {
                  const layer = point.payload;
                  return Math.abs(layer.mean) < 0.0001 || Math.abs(layer.mean) > 10 ? 6 : 4;
                }
              } : true}
            />
            {showPercentiles && (
              <>
                <Line
                  type="monotone"
                  dataKey="percentiles.p75"
                  stroke={selectedColors.light}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="percentiles.p25"
                  stroke={selectedColors.light}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="mean"
                stroke={selectedColors.main}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Gradient Flow Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'detailed' && (
            <>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Filter className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <RefreshCcw className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Download className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Chart */}
      <div className="p-4 space-y-6">
        {renderGradientChart()}

        {/* Layer Histograms */}
        {showHistograms && variant === 'detailed' && (
          <div className="grid grid-cols-2 gap-4">
            {data.map((layer) => 
              layer.histogram && (
                <div 
                  key={layer.layerName}
                  className={`p-4 rounded-lg border ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}
                >
                  <div className="text-sm font-medium mb-2">{layer.layerName}</div>
                  {renderHistogram(layer.histogram, layer.layerName)}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Problems Summary */}
      {variant === 'detailed' && (
        <div className="px-4 pb-4">
          <div className={`
            flex items-start gap-2 text-sm rounded-lg p-3
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <Info className="h-4 w-4 text-neutral-500 mt-0.5" />
            <div className="space-y-2">
              <div className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
                Analysis identified the following gradient issues:
              </div>
              <ul className="list-disc list-inside space-y-1">
                {data.map((layer) => {
                  if (Math.abs(layer.mean) < 0.0001 || Math.abs(layer.mean) > 10 || (layer.zeroGradientPercent || 0) > 0.5) {
                    return (
                      <li key={layer.layerName}>
                        <span className="font-medium">{layer.layerName}:</span>
                        {Math.abs(layer.mean) < 0.0001 && (
                          <span className="text-rose-500"> Vanishing gradients</span>
                        )}
                        {Math.abs(layer.mean) > 10 && (
                          <span className="text-amber-500"> Exploding gradients</span>
                        )}
                        {(layer.zeroGradientPercent || 0) > 0.5 && (
                          <span className="text-rose-500"> High zero gradient percentage</span>
                        )}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientFlow;