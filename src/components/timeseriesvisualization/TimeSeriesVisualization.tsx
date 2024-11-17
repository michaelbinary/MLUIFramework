import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const colors = {
  blue: { primary: '#3B82F6', anomaly: '#EF4444' },
  green: { primary: '#10B981', anomaly: '#EF4444' },
  purple: { primary: '#8B5CF6', anomaly: '#EF4444' },
};

interface TimeSeriesVisualizationProps {
  data: { name: string; data: any[] };
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'blue' | 'green' | 'purple';
  showConfidenceIntervals?: boolean;
  showSeasonality?: boolean;
  showAnomalies?: boolean;
  forecastHorizon?: number;
}

export const TimeSeriesVisualization: React.FC<TimeSeriesVisualizationProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  colorScale = 'blue',
  showConfidenceIntervals = true,
  showAnomalies = true,
  forecastHorizon = 30,
}) => {
  const colorPalette = colors[colorScale];

  const processedData = useMemo(() => {
    return data.data.map(point => ({
      ...point,
      timestamp: new Date(point.timestamp),
      anomalyColor: point.anomaly ? colorPalette.anomaly : 'transparent',
    }));
  }, [data, colorPalette]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="actual" stroke={colorPalette.primary} />
        {showAnomalies && (
          <Line
            type="monotone"
            dataKey="actual"
            stroke={colorPalette.anomaly}
            dot={(props) => {
              if (props.payload.anomaly) {
                return <circle cx={props.cx} cy={props.cy} r={4} fill={colorPalette.anomaly} />;
              }
              return null;
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesVisualization;
