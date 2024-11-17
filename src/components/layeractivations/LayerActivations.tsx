// src/components/layeractivations/LayerActivations.tsx

import React, { useState, useMemo } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Maximize2,
  Filter,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ActivationData {
  layerName: string;
  activations: number[][];
  channelNames?: string[];
  stats?: {
    min: number;
    max: number;
    mean: number;
    std: number;
  };
}

interface LayerActivationsProps {
  data: ActivationData[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'viridis' | 'magma' | 'plasma' | 'inferno';
  showChannelNames?: boolean;
  showStats?: boolean;
  interactive?: boolean;
  gridSize?: number;
}

// Color scale functions
const getColorScale = (scale: string) => {
  const scales = {
    viridis: [
      '#440154', '#482878', '#3E4989', '#31688E', '#26828E',
      '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'
    ],
    magma: [
      '#000004', '#1B0C42', '#4A0C6B', '#781C6D', '#A52C60',
      '#CF4446', '#ED6925', '#FB9B06', '#F7D03C', '#FCFDBF'
    ],
    plasma: [
      '#0D0887', '#41049D', '#6A00A8', '#8F0DA4', '#B12A90',
      '#CC4778', '#E16462', '#F2844B', '#FCA636', '#FCE726'
    ],
    inferno: [
      '#000004', '#160B39', '#420A68', '#6A176E', '#932667',
      '#BC3754', '#DD513A', '#F37819', '#FCA50A', '#F0F921'
    ]
  };
  return scales[scale as keyof typeof scales] || scales.viridis;
};

const getColor = (value: number, min: number, max: number, scale: string[]): string => {
  const normalizedValue = (value - min) / (max - min);
  const index = Math.min(Math.floor(normalizedValue * (scale.length - 1)), scale.length - 1);
  return scale[index];
};

export const LayerActivations: React.FC<LayerActivationsProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  colorScale = 'viridis',
  showChannelNames = true,
  showStats = true,
  interactive = true,
  gridSize = 4
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const [selectedLayer, setSelectedLayer] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);

  const scale = useMemo(() => getColorScale(colorScale), [colorScale]);
  const currentLayer = data[selectedLayer];

  const cellSize = useMemo(() => {
    const base = 24;
    return base * zoomLevel;
  }, [zoomLevel]);

  const renderHeatmap = (activations: number[][], stats: ActivationData['stats']) => {
    const { min = Math.min(...activations.flat()), max = Math.max(...activations.flat()) } = stats || {};
    
    return (
      <div className="grid gap-0.5" style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
      }}>
        {activations.map((row, rowIdx) => 
          row.map((value, colIdx) => {
            const isSelected = selectedChannel === rowIdx * activations[0].length + colIdx;
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`
                  relative transition-all duration-200
                  ${interactive ? 'cursor-pointer hover:opacity-90' : ''}
                  ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                `}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: getColor(value, min, max, scale)
                }}
                onClick={() => interactive && setSelectedChannel(rowIdx * activations[0].length + colIdx)}
              >
                {variant === 'detailed' && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/75 flex items-center justify-center">
                    <span className="text-xs text-white font-mono">
                      {value.toFixed(3)}
                    </span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    );
  };

  const renderStats = (stats: ActivationData['stats']) => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-neutral-500">Min:</span>
          <span className="ml-2 font-mono">{stats.min.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-neutral-500">Max:</span>
          <span className="ml-2 font-mono">{stats.max.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-neutral-500">Mean:</span>
          <span className="ml-2 font-mono">{stats.mean.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-neutral-500">Std:</span>
          <span className="ml-2 font-mono">{stats.std.toFixed(3)}</span>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="space-y-4">
          <div className="text-sm font-medium">{currentLayer.layerName}</div>
          {renderHeatmap(currentLayer.activations, currentLayer.stats)}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">{currentLayer.layerName}</h3>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'detailed' && (
            <>
              <button 
                onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}
                className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setZoomLevel(z => Math.min(2, z + 0.25))}
                className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Grid className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Download className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Layer Navigation */}
      {data.length > 1 && (
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <button
            onClick={() => setSelectedLayer(l => Math.max(0, l - 1))}
            disabled={selectedLayer === 0}
            className={`p-1 rounded-md ${
              selectedLayer === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-sm">
            Layer {selectedLayer + 1} of {data.length}
          </div>
          <button
            onClick={() => setSelectedLayer(l => Math.min(data.length - 1, l + 1))}
            disabled={selectedLayer === data.length - 1}
            className={`p-1 rounded-md ${
              selectedLayer === data.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="space-y-6">
          {/* Heatmap */}
          <div className="flex justify-center">
            {renderHeatmap(currentLayer.activations, currentLayer.stats)}
          </div>

          {/* Channel Names */}
          {showChannelNames && currentLayer.channelNames && selectedChannel !== null && (
            <div className="text-center">
              <span className="text-sm text-neutral-500">Channel:</span>
              <span className="ml-2 font-medium">
                {currentLayer.channelNames[selectedChannel]}
              </span>
            </div>
          )}

          {/* Statistics */}
          {showStats && currentLayer.stats && (
            <div className="border-t border-neutral-200 pt-4">
              {renderStats(currentLayer.stats)}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {variant === 'detailed' && (
        <div className="px-4 pb-4">
          <div className={`
            flex items-start gap-2 text-sm rounded-lg p-3
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <Info className="h-4 w-4 text-neutral-500 mt-0.5" />
            <div className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
              Visualization shows activation patterns for each neuron in the layer.
              {interactive ? ' Click on cells to inspect individual channels.' : ''}
              Brighter colors indicate stronger activations.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerActivations;