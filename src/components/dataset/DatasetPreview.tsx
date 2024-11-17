// @ts-nocheck

// src/components/dataset/DatasetPreview.tsx

import React from 'react';
import { 
  Table, 
  BarChart3, 
  Database, 
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Info
} from 'lucide-react';

interface DataSummary {
  totalRows: number;
  totalColumns: number;
  missingValues: number;
  dataTypes: Record<string, string>;
  columnStats: Record<string, {
    min?: number;
    max?: number;
    mean?: number;
    unique?: number;
    missing?: number;
  }>;
}

interface DatasetPreviewProps {
  data: Array<Record<string, any>>;
  summary?: DataSummary;
  type?: 'tabular' | 'image' | 'text';
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  maxRows?: number;
  maxCols?: number;
}

const TabularPreview: React.FC<{ 
  data: Array<Record<string, any>>;
  maxRows: number;
  maxCols: number;
  isDark: boolean;
}> = ({ data, maxRows, maxCols, isDark }) => {
  if (!data.length) return null;

  const columns = Object.keys(data[0]).slice(0, maxCols);
  const rows = data.slice(0, maxRows);

  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-600'}`}>
        <thead>
          <tr className={isDark ? 'border-b border-neutral-700' : 'border-b border-neutral-200'}>
            {columns.map((col, i) => (
              <th key={i} className="p-2 text-left font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr 
              key={i} 
              className={`
                ${isDark ? 'border-b border-neutral-700' : 'border-b border-neutral-200'}
                ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-50'}
              `}
            >
              {columns.map((col, j) => (
                <td key={j} className="p-2">
                  {row[col]?.toString() || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ImagePreview: React.FC<{
  data: Array<{ url: string; label?: string }>;
  maxItems: number;
  isDark: boolean;
}> = ({ data, maxItems, isDark }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {data.slice(0, maxItems).map((item, idx) => (
        <div 
          key={idx}
          className={`
            relative group rounded-lg overflow-hidden border
            ${isDark ? 'border-neutral-700' : 'border-neutral-200'}
          `}
        >
          <img 
            src={item.url} 
            alt={item.label || `Image ${idx + 1}`}
            className="w-full aspect-square object-cover"
          />
          {item.label && (
            <div className={`
              absolute bottom-0 left-0 right-0 p-2 text-xs
              ${isDark ? 'bg-neutral-800/90' : 'bg-white/90'}
              transition-opacity opacity-0 group-hover:opacity-100
            `}>
              {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const TextPreview: React.FC<{
  data: Array<{ text: string; label?: string }>;
  maxItems: number;
  isDark: boolean;
}> = ({ data, maxItems, isDark }) => {
  return (
    <div className="space-y-4">
      {data.slice(0, maxItems).map((item, idx) => (
        <div 
          key={idx}
          className={`
            p-4 rounded-lg border
            ${isDark ? 'border-neutral-700' : 'border-neutral-200'}
          `}
        >
          <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
            {item.text.length > 200 ? item.text.slice(0, 200) + '...' : item.text}
          </p>
          {item.label && (
            <div className={`mt-2 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Label: {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DatasetStats: React.FC<{
  summary: DataSummary;
  isDark: boolean;
}> = ({ summary, isDark }) => {
  return (
    <div className={`
      grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg border
      ${isDark ? 'border-neutral-700' : 'border-neutral-200'}
    `}>
      <div>
        <div className="text-sm text-neutral-500">Total Rows</div>
        <div className="font-mono text-lg">{summary.totalRows.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-sm text-neutral-500">Columns</div>
        <div className="font-mono text-lg">{summary.totalColumns}</div>
      </div>
      <div>
        <div className="text-sm text-neutral-500">Missing Values</div>
        <div className="font-mono text-lg">{summary.missingValues.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-sm text-neutral-500">Data Types</div>
        <div className="font-mono text-lg">{Object.keys(summary.dataTypes).length}</div>
      </div>
    </div>
  );
};

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({
  data,
  summary,
  type = 'tabular',
  theme = 'light',
  variant = 'default',
  maxRows = 5,
  maxCols = 6
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const getPreviewIcon = () => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      default: return <Table className="h-5 w-5" />;
    }
  };

  const renderPreview = () => {
    switch (type) {
      case 'image':
        return <ImagePreview 
          data={data as Array<{ url: string; label?: string }>}
          maxItems={12}
          isDark={isDark}
        />;
      case 'text':
        return <TextPreview 
          data={data as Array<{ text: string; label?: string }>}
          maxItems={5}
          isDark={isDark}
        />;
      default:
        return <TabularPreview 
          data={data}
          maxRows={maxRows}
          maxCols={maxCols}
          isDark={isDark}
        />;
    }
  };

  return (
    <div className={baseClasses}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-neutral-500" />
            <h3 className="font-medium">Dataset Preview</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              {getPreviewIcon()}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && variant !== 'compact' && (
          <div className="px-4">
            <DatasetStats summary={summary} isDark={isDark} />
          </div>
        )}

        {/* Data Preview */}
        <div className="p-4">
          {renderPreview()}
        </div>

        {/* Footer with Info */}
        {variant === 'detailed' && (
          <div className="px-4 pb-4">
            <div className={`
              flex items-start gap-2 text-sm rounded-lg p-3
              ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
            `}>
              <Info className="h-4 w-4 text-neutral-500 mt-0.5" />
              <div className="text-neutral-500">
                Displaying a preview of the dataset. 
                {type === 'tabular' && `Showing ${maxRows} rows and ${maxCols} columns of ${data.length} total records.`}
                {type === 'image' && 'Showing a subset of images from the dataset.'}
                {type === 'text' && 'Showing a sample of text entries from the dataset.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetPreview;