// src/components/losslandscape/LossLandscape.tsx

import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Surface,
  Contour
} from 'recharts';
import { Mountain, Minimize2, Maximize2, Activity } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface OptimizationPoint {
  x: number;
  y: number;
  z: number;
  epoch: number;
}

interface LossLandscapeProps {
  // Surface data points for the loss landscape
  surfaceData: Point3D[];
  // Optimization trajectory points showing how the model parameters evolved
  trajectoryData: OptimizationPoint[];
  // Range of values for the visualization
  range?: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  view?: '3d' | 'contour' | 'both';
}

export const LossLandscape: React.FC<LossLandscapeProps> = ({
  surfaceData,
  trajectoryData,
  range = {
    x: [-1, 1],
    y: [-1, 1],
    z: [0, 5]
  },
  theme = 'light',
  variant = 'default',
  view = 'both'
}) => {
  const isDark = theme === 'dark';

  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
  `;

  const colors = {
    surface: {
      high: isDark ? '#ef4444' : '#dc2626',
      mid: isDark ? '#3b82f6' : '#2563eb',
      low: isDark ? '#22c55e' : '#16a34a'
    },
    trajectory: isDark ? '#f97316' : '#ea580c',
    grid: isDark ? '#525252' : '#e5e7eb',
    text: isDark ? '#d4d4d4' : '#525252'
  };

  // Generate gradients for the surface coloring
  const colorScale = useMemo(() => {
    const [minZ, maxZ] = range.z;
    const normalize = (z: number) => (z - minZ) / (maxZ - minZ);
    
    return (z: number) => {
      const norm = normalize(z);
      if (norm > 0.66) return colors.surface.high;
      if (norm > 0.33) return colors.surface.mid;
      return colors.surface.low;
    };
  }, [range.z, colors.surface]);

  // Calculate optimization progress metrics
  const optimizationMetrics = useMemo(() => {
    const initialLoss = trajectoryData[0]?.z || 0;
    const finalLoss = trajectoryData[trajectoryData.length - 1]?.z || 0;
    const improvement = ((initialLoss - finalLoss) / initialLoss) * 100;
    const totalEpochs = trajectoryData[trajectoryData.length - 1]?.epoch || 0;

    return {
      initialLoss,
      finalLoss,
      improvement,
      totalEpochs
    };
  }, [trajectoryData]);

  const renderSurface = () => (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            type="number"
            dataKey="x"
            domain={range.x}
            tick={{ fill: colors.text }}
            label={{ value: 'Parameter 1', fill: colors.text }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={range.y}
            tick={{ fill: colors.text }}
            label={{ value: 'Parameter 2', fill: colors.text }}
          />
          <ZAxis
            type="number"
            dataKey="z"
            domain={range.z}
            range={[20, 400]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className={`
                  p-2 rounded shadow-lg border
                  ${isDark 
                    ? 'bg-neutral-900 border-neutral-800' 
                    : 'bg-white border-neutral-200'}
                `}>
                  <div className="space-y-1 text-sm">
                    <div className={isDark ? 'text-neutral-200' : 'text-neutral-700'}>
                      Parameter 1: {data.x.toFixed(3)}
                    </div>
                    <div className={isDark ? 'text-neutral-200' : 'text-neutral-700'}>
                      Parameter 2: {data.y.toFixed(3)}
                    </div>
                    <div className={isDark ? 'text-neutral-200' : 'text-neutral-700'}>
                      Loss: {data.z.toFixed(3)}
                    </div>
                    {data.epoch !== undefined && (
                      <div className={isDark ? 'text-neutral-200' : 'text-neutral-700'}>
                        Epoch: {data.epoch}
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
          {/* Surface scatter points */}
          <Scatter
            data={surfaceData}
            fill={(entry) => colorScale(entry.z)}
          />
          {/* Optimization trajectory */}
          <Scatter
            data={trajectoryData}
            fill={colors.trajectory}
            line={{ stroke: colors.trajectory }}
            lineType="monotone"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="h-4 w-4 text-neutral-500" />
              <span className={`text-sm font-medium ${
                isDark ? 'text-neutral-200' : 'text-neutral-700'
              }`}>
                Loss Landscape
              </span>
            </div>
          </div>
          {renderSurface()}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`${baseClasses} border`}>
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-neutral-500" />
              <span className={`font-medium ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Loss Landscape Analysis
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-opacity-50 border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Initial Loss</div>
              <div className="text-2xl font-mono font-semibold">
                {optimizationMetrics.initialLoss.toFixed(3)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Final Loss</div>
              <div className="text-2xl font-mono font-semibold">
                {optimizationMetrics.finalLoss.toFixed(3)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Improvement</div>
              <div className="text-2xl font-mono font-semibold">
                {optimizationMetrics.improvement.toFixed(1)}%
              </div>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Epochs</div>
              <div className="text-2xl font-mono font-semibold">
                {optimizationMetrics.totalEpochs}
              </div>
            </div>
          </div>

          {/* Visualization */}
          {view === 'both' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderSurface()}
              <div className="h-[400px]">
                {/* Contour plot would go here - similar structure to surface plot */}
              </div>
            </div>
          ) : (
            renderSurface()
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" 
                   style={{ backgroundColor: colors.surface.high }} />
              <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
                High Loss
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full"
                   style={{ backgroundColor: colors.surface.low }} />
              <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
                Low Loss
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full"
                   style={{ backgroundColor: colors.trajectory }} />
              <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
                Optimization Path
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${baseClasses} border p-4`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-neutral-500" />
            <span className={`font-medium ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Loss Landscape
            </span>
          </div>
        </div>
        {renderSurface()}
      </div>
    </div>
  );
};

export default LossLandscape;