// src/components/resourcemonitor/ResourceMonitor.tsx

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import {
  Cpu,
  GaugeCircle,
  Download,
  Info,
  Zap,
  HardDrive,
  Database,
  AlertTriangle,
  Clock,
  BarChart2
} from 'lucide-react';

interface ResourceMetrics {
  timestamp: number;
  gpu: {
    utilization: number;
    memory: number;
    temperature: number;
    powerDraw: number;
  };
  cpu: {
    utilization: number;
    memory: number;
    temperature: number;
  };
  training: {
    samplesPerSecond: number;
    batchTime: number;
    throughput: number;
    memoryAllocated: number;
  };
  bottlenecks?: {
    type: 'CPU' | 'GPU' | 'Memory' | 'I/O';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

interface ResourceMonitorProps {
  data: ResourceMetrics[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showBottlenecks?: boolean;
  metrics?: Array<'gpu' | 'cpu' | 'training'>;
  realTime?: boolean;
  colorScale?: 'blue' | 'green' | 'purple';
  timeWindow?: number; // in minutes
}

const formatValue = (value: number, type: string): string => {
  switch (type) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'memory':
      return value < 1024 
        ? `${value.toFixed(1)} MB`
        : `${(value / 1024).toFixed(1)} GB`;
    case 'temperature':
      return `${value.toFixed(1)}°C`;
    case 'power':
      return `${value.toFixed(1)}W`;
    case 'throughput':
      return `${value.toFixed(1)} samples/s`;
    case 'time':
      return `${value.toFixed(1)}ms`;
    default:
      return value.toFixed(2);
  }
};

const getStatusColor = (value: number, type: string): string => {
  if (type === 'temperature') {
    if (value > 85) return 'text-rose-500';
    if (value > 75) return 'text-amber-500';
    return 'text-emerald-500';
  }
  if (type === 'utilization') {
    if (value > 95) return 'text-amber-500';
    if (value < 20) return 'text-rose-500';
    return 'text-emerald-500';
  }
  return 'text-neutral-900';
};

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  showBottlenecks = true,
  metrics = ['gpu', 'cpu', 'training'],
  realTime = false,
  colorScale = 'blue',
  timeWindow = 5
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

  // Filter data based on time window
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const cutoff = Date.now() - timeWindow * 60 * 1000;
    return data.filter(d => d.timestamp > cutoff);
  }, [data, timeWindow]);

  const MetricGauge = ({ value, max, type }: { value: number; max: number; type: string }) => (
    <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300
          ${value / max > 0.9 ? 'bg-rose-500' : value / max > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const metrics = payload[0].payload;
    return (
      <div className={`
        p-3 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {new Date(metrics.timestamp).toLocaleTimeString()}
          </div>
          {['gpu', 'cpu', 'training'].map(category => (
            <div key={category} className="space-y-1">
              <div className="text-sm font-medium capitalize">{category}</div>
              {Object.entries(metrics[category]).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-neutral-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-mono">
                    {formatValue(value as number, key.includes('memory') ? 'memory' : 'default')}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium">GPU</div>
              <MetricGauge 
                value={data[data.length - 1]?.gpu.utilization || 0} 
                max={100}
                type="utilization"
              />
            </div>
            <div>
              <div className="text-sm font-medium">CPU</div>
              <MetricGauge 
                value={data[data.length - 1]?.cpu.utilization || 0} 
                max={100}
                type="utilization"
              />
            </div>
            <div>
              <div className="text-sm font-medium">Memory</div>
              <MetricGauge 
                value={data[data.length - 1]?.gpu.memory || 0} 
                max={100}
                type="memory"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderMetricChart = (metricType: 'gpu' | 'cpu' | 'training') => {
    const metricConfigs = {
      gpu: [
        { key: 'utilization', name: 'GPU Util', color: selectedColors.main },
        { key: 'memory', name: 'Memory', color: selectedColors.light }
      ],
      cpu: [
        { key: 'utilization', name: 'CPU Util', color: selectedColors.main },
        { key: 'memory', name: 'Memory', color: selectedColors.light }
      ],
      training: [
        { key: 'samplesPerSecond', name: 'Samples/s', color: selectedColors.main },
        { key: 'throughput', name: 'Throughput', color: selectedColors.light }
      ]
    };

    return (
      <div className={`p-4 border rounded-lg ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#525252' : '#E5E7EB'}
              />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip content={<CustomTooltip />} />
              {metricConfigs[metricType].map((config, index) => (
                <Line
                  key={config.key}
                  type="monotone"
                  dataKey={`${metricType}.${config.key}`}
                  name={config.name}
                  stroke={config.color}
                  dot={false}
                  isAnimationActive={!realTime}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <GaugeCircle className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Resource Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'detailed' && (
            <>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <BarChart2 className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Download className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Current Metrics */}
      <div className="p-4 border-b border-neutral-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.includes('gpu') && (
            <>
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Cpu className="h-4 w-4" />
                  GPU Utilization
                </div>
                <div className={`text-2xl font-mono ${
                  getStatusColor(data[data.length - 1]?.gpu.utilization || 0, 'utilization')
                }`}>
                  {formatValue(data[data.length - 1]?.gpu.utilization || 0, 'percentage')}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Database className="h-4 w-4" />
                  GPU Memory
                </div>
                <div className="text-2xl font-mono">
                  {formatValue(data[data.length - 1]?.gpu.memory || 0, 'memory')}
                </div>
              </div>
            </>
          )}
          {metrics.includes('training') && (
            <>
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Zap className="h-4 w-4" />
                  Throughput
                </div>
                <div className="text-2xl font-mono">
                  {formatValue(data[data.length - 1]?.training.throughput || 0, 'throughput')}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Clock className="h-4 w-4" />
                  Batch Time
                </div>
                <div className="text-2xl font-mono">
                  {formatValue(data[data.length - 1]?.training.batchTime || 0, 'time')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="p-4 space-y-4">
        {metrics.map(metric => renderMetricChart(metric))}
      </div>

      {/* Bottlenecks */}
      {showBottlenecks && variant === 'detailed' && data[data.length - 1]?.bottlenecks && (
        <div className="px-4 pb-4">
          <div className={`
            rounded-lg p-3 space-y-2
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Performance Bottlenecks</span>
            </div>
            <div className="space-y-2">
              {data[data.length - 1].bottlenecks?.map((bottleneck, idx) => (
                <div key={idx} className={`
                  flex items-start gap-2 text-sm rounded p-2
                  ${isDark ? 'bg-neutral-700' : 'bg-white'}
                `}>
                  <div className={`
                    px-2 py-0.5 rounded text-xs font-medium
                    ${bottleneck.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                      bottleneck.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'}
                  `}>
                    {bottleneck.type}
                  </div>
                  <div>{bottleneck.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceMonitor;