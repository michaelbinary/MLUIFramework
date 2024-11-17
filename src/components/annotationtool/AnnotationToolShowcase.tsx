// src/components/annotationtool/AnnotationToolShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { AnnotationTool } from './AnnotationTool';

// Sample data for different annotation scenarios
const generateSampleData = (type: 'text' | 'image' | 'categorical') => {
  switch (type) {
    case 'text':
      return Array.from({ length: 5 }, (_, i) => ({
        id: `text_${i + 1}`,
        content: {
          type: 'text',
          data: `Sample text content ${i + 1} for annotation. This could be a sentence, paragraph, or document that needs to be classified, labeled, or analyzed.`
        },
        labels: [],
        metadata: {
          source: 'Sample Dataset',
          timestamp: Date.now(),
          length: Math.floor(Math.random() * 100 + 50)
        }
      }));

    case 'image':
      return Array.from({ length: 5 }, (_, i) => ({
        id: `image_${i + 1}`,
        content: {
          type: 'image',
          data: `/api/placeholder/400/300?text=Sample+Image+${i + 1}`
        },
        labels: [],
        metadata: {
          resolution: '400x300',
          format: 'JPEG',
          size: `${Math.floor(Math.random() * 500 + 100)}KB`
        }
      }));

    case 'categorical':
      return Array.from({ length: 5 }, (_, i) => ({
        id: `cat_${i + 1}`,
        content: {
          type: 'categorical',
          data: {
            'Field 1': ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
            'Field 2': Math.floor(Math.random() * 100),
            'Field 3': ['Yes', 'No'][Math.floor(Math.random() * 2)],
          }
        },
        labels: [],
        metadata: {
          category: ['Type A', 'Type B', 'Type C'][Math.floor(Math.random() * 3)],
          priority: Math.floor(Math.random() * 5 + 1)
        }
      }));

    default:
      return [];
  }
};

const SAMPLE_LABELS = [
  { id: 'positive', name: 'Positive', color: '#10B981', shortcut: 'p' },
  { id: 'negative', name: 'Negative', color: '#EF4444', shortcut: 'n' },
  { id: 'neutral', name: 'Neutral', color: '#6B7280', shortcut: 'u' },
  { id: 'spam', name: 'Spam', color: '#F59E0B', shortcut: 's' },
  { id: 'urgent', name: 'Urgent', color: '#8B5CF6', shortcut: 'r' }
];

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
          Content Type
        </label>
        <select
          value={values.contentType}
          onChange={(e) => onChange({ ...values, contentType: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="text">Text Content</option>
          <option value="image">Image Content</option>
          <option value="categorical">Categorical Data</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.multiLabel}
            onChange={(e) => onChange({ ...values, multiLabel: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Allow Multiple Labels</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showConfidence}
            onChange={(e) => onChange({ ...values, showConfidence: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Confidence</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showHistory}
            onChange={(e) => onChange({ ...values, showHistory: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show History</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.enableShortcuts}
            onChange={(e) => onChange({ ...values, enableShortcuts: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Enable Shortcuts</span>
        </label>
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

export const AnnotationToolShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    contentType: 'text',
    multiLabel: false,
    showConfidence: true,
    showHistory: true,
    enableShortcuts: true
  });

  const generateCode = () => {
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.multiLabel) props.push('multiLabel={true}');
    if (!config.showConfidence) props.push('showConfidence={false}');
    if (!config.showHistory) props.push('showHistory={false}');
    if (!config.enableShortcuts) props.push('enableShortcuts={false}');

    const sampleData = generateSampleData(config.contentType as any)[0];
    return `<AnnotationTool
  data={[${JSON.stringify(sampleData, null, 2)}]}
  labels={${JSON.stringify(SAMPLE_LABELS, null, 2)}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Annotation Tool Component
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
                <AnnotationTool
                  data={generateSampleData(config.contentType as any)}
                  labels={SAMPLE_LABELS}
                  theme={config.theme}
                  variant={config.variant}
                  multiLabel={config.multiLabel}
                  showConfidence={config.showConfidence}
                  showHistory={config.showHistory}
                  enableShortcuts={config.enableShortcuts}
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

export default AnnotationToolShowcase;