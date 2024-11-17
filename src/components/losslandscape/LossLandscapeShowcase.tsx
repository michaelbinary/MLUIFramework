// @ts-nocheck

// src/components/losslandscape/LossLandscapeShowcase.tsx

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { LossLandscape } from './LossLandscape';

// Generate sample loss landscape data
const generateSampleData = (
    resolution: number = 20,
    noiseLevel: number = 0.1
  ) => {
    const surfaceData: Array<{ x: number; y: number; z: number }> = [];
    const trajectoryData: Array<{ x: number; y: number; z: number; epoch: number }> = [];
  
    // Generate surface data with two local minima
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = (i / (resolution - 1)) * 2 - 1;
        const y = (j / (resolution - 1)) * 2 - 1;
        
        // Create a surface with two minima - fixed exponentiation syntax
        const z = (
          Math.exp((-((x + 0.5) ** 2)) - ((y + 0.5) ** 2)) * 2 +
          Math.exp((-((x - 0.5) ** 2)) - ((y - 0.5) ** 2)) * 1.5 +
          ((x ** 2) + (y ** 2)) * 0.2 +
          (Math.random() - 0.5) * noiseLevel
        );
  
        surfaceData.push({ x, y, z });
      }
    }
  
    // Generate optimization trajectory
    const numSteps = 50;
    let currentX = -0.8;
    let currentY = -0.8;
    
    for (let i = 0; i < numSteps; i++) {
      const epoch = i;
      const target_x = 0.5;
      const target_y = 0.5;
      
      // Simple gradient descent simulation
      currentX += (target_x - currentX) * 0.1 + (Math.random() - 0.5) * 0.05;
      currentY += (target_y - currentY) * 0.1 + (Math.random() - 0.5) * 0.05;
      
      const z = (
        Math.exp((-((currentX + 0.5) ** 2)) - ((currentY + 0.5) ** 2)) * 2 +
        Math.exp((-((currentX - 0.5) ** 2)) - ((currentY - 0.5) ** 2)) * 1.5 +
        ((currentX ** 2) + (currentY ** 2)) * 0.2
      );
  
      trajectoryData.push({ x: currentX, y: currentY, z, epoch });
    }
  
    return { surfaceData, trajectoryData };
  };

const Controls = ({ values, onChange }) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-neutral-200">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Theme
        </label>
        <select
          value={values.theme}
          onChange={(e) => onChange({ ...values, theme: e.target.value })}
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
                  onChange={(e) => onChange({ ...values, variant: e.target.value })}
                  className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
        
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  View
                </label>
                <select
                  value={values.view}
                  onChange={(e) => onChange({ ...values, view: e.target.value })}
                  className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
                >
                  <option value="3d">3D Surface</option>
                  <option value="contour">Contour</option>
                  <option value="both">Both</option>
                </select>
              </div>
        
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Resolution
                </label>
                <select
                  value={values.resolution}
                  onChange={(e) => onChange({ ...values, resolution: Number(e.target.value) })}
                  className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
                >
                  <option value="10">Low (10x10)</option>
                  <option value="20">Medium (20x20)</option>
                  <option value="30">High (30x30)</option>
                </select>
              </div>
        
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Noise Level
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.01"
                  value={values.noiseLevel}
                  onChange={(e) => onChange({ ...values, noiseLevel: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-neutral-500 mt-1">
                  {(values.noiseLevel * 100).toFixed(0)}% noise
                </div>
              </div>
            </div>
          );
        };
        
        const CodeBlock = ({ code, onCopy }) => {
          const [copied, setCopied] = useState(false);
        
          const handleCopy = () => {
            onCopy();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          };
        
          return (
            <div className="relative">
              <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
                <code>{code}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 
                         text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          );
        };
        
        export const LossLandscapeShowcase = () => {
          const [activeTab, setActiveTab] = useState('preview');
          const [config, setConfig] = useState({
            theme: 'light',
            variant: 'default',
            view: '3d',
            resolution: 20,
            noiseLevel: 0.1
          });
        
          const { surfaceData, trajectoryData } = useMemo(() => 
            generateSampleData(config.resolution, config.noiseLevel),
            [config.resolution, config.noiseLevel]
          );
        
          const generateCode = () => {
            const props = [];
            
            if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
            if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
            if (config.view !== '3d') props.push(`view="${config.view}"`);
        
            return `<LossLandscape
          surfaceData={${JSON.stringify(surfaceData.slice(0, 3), null, 2)}...}
          trajectoryData={${JSON.stringify(trajectoryData.slice(0, 3), null, 2)}...}
          range={{
            x: [-1, 1],
            y: [-1, 1],
            z: [0, 5]
          }}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
        />`;
          };
        
          return (
            <div className="max-w-7xl mx-auto p-6">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
                <div className="border-b border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Loss Landscape Visualization
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                          ${activeTab === 'preview' 
                            ? 'bg-neutral-900 text-white' 
                            : 'text-neutral-600 hover:text-neutral-900'}`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setActiveTab('code')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                          ${activeTab === 'code' 
                            ? 'bg-neutral-900 text-white' 
                            : 'text-neutral-600 hover:text-neutral-900'}`}
                      >
                        Code
                      </button>
                    </div>
                  </div>
                </div>
        
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                  <div className="lg:col-span-1">
                    <Controls values={config} onChange={setConfig} />
                  </div>
        
                  <div className="lg:col-span-3">
                    {activeTab === 'preview' ? (
                      <div className={config.theme === 'dark' ? 'bg-neutral-900 p-6 rounded-lg' : 'bg-neutral-50 p-6 rounded-lg'}>
                        <LossLandscape
                          surfaceData={surfaceData}
                          trajectoryData={trajectoryData}
                          theme={config.theme}
                          variant={config.variant}
                          view={config.view as '3d' | 'contour' | 'both'}
                        />
                      </div>
                    ) : (
                      <CodeBlock 
                        code={generateCode()}
                        onCopy={() => navigator.clipboard.writeText(generateCode())}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        };
        
        export default LossLandscapeShowcase;
