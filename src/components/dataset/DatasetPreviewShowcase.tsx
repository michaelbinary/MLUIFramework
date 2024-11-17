// @ts-nocheck

// src/components/dataset/DatasetPreviewShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DatasetPreview } from './DatasetPreview';

// Sample datasets
const SAMPLE_DATA = {
  tabular: [
    { id: 1, name: 'Sample A', value: 23.4, category: 'Cat 1', timestamp: '2024-01-01', status: 'active' },
    { id: 2, name: 'Sample B', value: 45.6, category: 'Cat 2', timestamp: '2024-01-02', status: 'pending' },
    { id: 3, name: 'Sample C', value: 78.9, category: 'Cat 1', timestamp: '2024-01-03', status: 'active' },
    { id: 4, name: 'Sample D', value: 12.3, category: 'Cat 3', timestamp: '2024-01-04', status: 'inactive' },
    { id: 5, name: 'Sample E', value: 34.5, category: 'Cat 2', timestamp: '2024-01-05', status: 'pending' },
  ],
  image: [
    { url: '/api/placeholder/200/200', label: 'Cat' },
    { url: '/api/placeholder/200/200', label: 'Dog' },
    { url: '/api/placeholder/200/200', label: 'Bird' },
    { url: '/api/placeholder/200/200', label: 'Fish' },
    { url: '/api/placeholder/200/200', label: 'Horse' },
    { url: '/api/placeholder/200/200', label: 'Rabbit' },
  ],
  text: [
    { text: 'This is a sample text entry for natural language processing tasks. It contains multiple sentences and can be used for various NLP applications.', label: 'Positive' },
    { text: 'Another example of text data that might be used for sentiment analysis, classification, or other text processing tasks.', label: 'Neutral' },
    { text: 'The quick brown fox jumps over the lazy dog. This sentence contains all letters of the alphabet.', label: 'Negative' },
  ]
};

const SAMPLE_SUMMARY = {
  totalRows: 1000,
  totalColumns: 6,
  missingValues: 45,
  dataTypes: {
    id: 'integer',
    name: 'string',
    value: 'float',
    category: 'string',
    timestamp: 'datetime',
    status: 'string'
  },
  columnStats: {
    value: {
      min: 0,
      max: 100,
      mean: 45.6,
      unique: 156,
      missing: 12
    }
  }
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
          Data Type
        </label>
        <select
          value={values.dataType}
          onChange={(e) => onChange({ ...values, dataType: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="tabular">Tabular</option>
          <option value="image">Image</option>
          <option value="text">Text</option>
        </select>
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

export const DatasetPreviewShowcase = () => {
const [activeTab, setActiveTab] = useState('preview');
const [config, setConfig] = useState({
theme: 'light',
variant: 'default',
dataType: 'tabular'
});

const generateCode = () => {
const props = [];
const dataType = config.dataType as 'tabular' | 'image' | 'text';

if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
if (dataType !== 'tabular') props.push(`type="${dataType}"`);

let dataExample = '';
if (dataType === 'tabular') {
dataExample = `[
{ id: 1, name: 'Sample A', value: 23.4, category: 'Cat 1', timestamp: '2024-01-01', status: 'active' },
{ id: 2, name: 'Sample B', value: 45.6, category: 'Cat 2', timestamp: '2024-01-02', status: 'pending' },
// ... more data
]`;
} else if (dataType === 'image') {
dataExample = `[
{ url: '/path/to/image1.jpg', label: 'Cat' },
{ url: '/path/to/image2.jpg', label: 'Dog' },
// ... more images
]`;
} else {
dataExample = `[
{ text: 'This is a sample text entry...', label: 'Positive' },
{ text: 'Another example of text data...', label: 'Neutral' },
// ... more text samples
]`;
}

return `<DatasetPreview
data={${dataExample}}
summary={{
totalRows: 1000,
totalColumns: 6,
missingValues: 45,
dataTypes: {
id: 'integer',
name: 'string',
value: 'float',
// ... more data types
},
columnStats: {
value: {
min: 0,
max: 100,
mean: 45.6,
unique: 156,
missing: 12
}
}
}}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
};

return (
<div className="max-w-7xl mx-auto p-6">
<div className="bg-white rounded-xl shadow-sm border border-neutral-200">
<div className="border-b border-neutral-200 p-4">
<div className="flex items-center justify-between">
<h2 className="text-lg font-semibold text-neutral-900">
Dataset Preview Component
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
<DatasetPreview
 data={SAMPLE_DATA[config.dataType as keyof typeof SAMPLE_DATA]}
 summary={SAMPLE_SUMMARY}
 theme={config.theme}
 variant={config.variant}
 type={config.dataType as 'tabular' | 'image' | 'text'}
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

export default DatasetPreviewShowcase;