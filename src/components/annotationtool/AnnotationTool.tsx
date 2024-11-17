// src/components/annotationtool/AnnotationTool.tsx

import React, { useState, useRef } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Save,
  Undo,
  Redo,
  Download,
  Upload,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Info,
  Edit3
} from 'lucide-react';

interface AnnotationLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
  shortcut?: string;
}

interface AnnotationItem {
  id: string;
  content: {
    type: 'text' | 'image' | 'categorical' | 'numerical';
    data: any;
  };
  labels: {
    labelId: string;
    confidence?: number;
    annotator?: string;
    timestamp?: number;
    comment?: string;
  }[];
  metadata?: Record<string, any>;
}

interface AnnotationHistory {
  action: 'add' | 'remove' | 'modify';
  itemId: string;
  labelId: string;
  timestamp: number;
  annotator: string;
}

interface AnnotationToolProps {
  data: AnnotationItem[];
  labels: AnnotationLabel[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  multiLabel?: boolean;
  showConfidence?: boolean;
  showHistory?: boolean;
  enableShortcuts?: boolean;
  onAnnotate?: (item: AnnotationItem, labels: any[]) => void;
  onExport?: (annotations: any[]) => void;
}

export const AnnotationTool: React.FC<AnnotationToolProps> = ({
  data,
  labels,
  theme = 'light',
  variant = 'default',
  multiLabel = false,
  showConfidence = true,
  showHistory = true,
  enableShortcuts = true,
  onAnnotate,
  onExport
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [history, setHistory] = useState<AnnotationHistory[]>([]);
  const [confidence, setConfidence] = useState<number>(1.0);
  const [comment, setComment] = useState('');
  const undoStack = useRef<AnnotationHistory[]>([]);
  const redoStack = useRef<AnnotationHistory[]>([]);

  const currentItem = data[currentIndex];

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!enableShortcuts) return;

    labels.forEach(label => {
      if (label.shortcut && e.key === label.shortcut) {
        handleAnnotation(label.id);
      }
    });

    // Navigation shortcuts
    if (e.key === 'ArrowLeft') navigatePrev();
    if (e.key === 'ArrowRight') navigateNext();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, enableShortcuts]);

  const handleAnnotation = (labelId: string) => {
    const newLabels = multiLabel 
      ? [...currentItem.labels]
      : [];

    const existingLabel = newLabels.findIndex(l => l.labelId === labelId);
    if (existingLabel >= 0) {
      newLabels.splice(existingLabel, 1);
    } else {
      newLabels.push({
        labelId,
        confidence,
        annotator: 'current_user',
        timestamp: Date.now(),
        comment
      });
    }

    const updatedItem = {
      ...currentItem,
      labels: newLabels
    };

    onAnnotate?.(updatedItem, newLabels);
    addToHistory({
      action: existingLabel >= 0 ? 'remove' : 'add',
      itemId: currentItem.id,
      labelId,
      timestamp: Date.now(),
      annotator: 'current_user'
    });

    if (!multiLabel) {
      navigateNext();
    }
  };

  const addToHistory = (action: AnnotationHistory) => {
    setHistory(prev => [...prev, action]);
    undoStack.current.push(action);
    redoStack.current = [];
  };

  const undo = () => {
    const lastAction = undoStack.current.pop();
    if (lastAction) {
      redoStack.current.push(lastAction);
      // Reverse the last action
      handleAnnotation(lastAction.labelId);
    }
  };

  const redo = () => {
    const nextAction = redoStack.current.pop();
    if (nextAction) {
      undoStack.current.push(nextAction);
      handleAnnotation(nextAction.labelId);
    }
  };

  const navigateNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setComment('');
    }
  };

  const navigatePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setComment('');
    }
  };

  const renderContent = (item: AnnotationItem) => {
    switch (item.content.type) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={item.content.data}
              alt="Content for annotation"
              className="w-full rounded-lg"
            />
            {/* Image annotation overlay here */}
          </div>
        );
      
      case 'text':
        return (
          <div className={`
            p-4 rounded-lg
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <p className="whitespace-pre-wrap">{item.content.data}</p>
          </div>
        );
      
      case 'categorical':
        return (
          <div className="space-y-2">
            {Object.entries(item.content.data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-neutral-500">{key}:</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="text-neutral-500">
            Unsupported content type
          </div>
        );
    }
  };

  const renderLabels = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {labels.map(label => {
          const isSelected = currentItem.labels.some(l => l.labelId === label.id);
          return (
            <button
              key={label.id}
              onClick={() => handleAnnotation(label.id)}
              className={`
                flex items-center gap-2 p-2 rounded-lg border transition-colors
                ${isSelected 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'hover:bg-neutral-50 border-neutral-200'}
              `}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span>{label.name}</span>
              {label.shortcut && (
                <span className="ml-auto text-xs text-neutral-500">
                  {label.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="space-y-4">
          {renderContent(currentItem)}
          <div className="flex gap-2">
            {labels.slice(0, 3).map(label => (
              <button
                key={label.id}
                onClick={() => handleAnnotation(label.id)}
                className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm"
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Annotation Tool</h3>
          <span className="text-sm text-neutral-500">
            {currentIndex + 1} of {data.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={undoStack.current.length === 0}
            className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.current.length === 0}
            className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </button>
          {variant === 'detailed' && (
            <>
              <button className="p-1.5 rounded-md hover:bg-neutral-100">
                <Upload className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-neutral-100">
                <Download className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      {variant === 'detailed' && (
        <div className="p-4 border-b border-neutral-200">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg border
                  ${isDark 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-neutral-200'}
                `}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
            </div>
            <button className={`
              px-4 py-2 rounded-lg border
              ${isDark ? 'border-neutral-700' : 'border-neutral-200'}
              hover:bg-neutral-50
            `}>
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-2 divide-x divide-neutral-200">
        {/* Content Panel */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={navigatePrev}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm text-neutral-500">Item ID:</span>
              <span className="ml-2 font-mono">{currentItem.id}</span>
            </div>
            <button
              onClick={navigateNext}
              disabled={currentIndex === data.length - 1}
              className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {renderContent(currentItem)}

          {variant === 'detailed' && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Metadata</div>
              <div className={`
                rounded-lg p-3
                ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
              `}>
                {Object.entries(currentItem.metadata || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-neutral-500">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Annotation Panel */}
        <div className="p-4 space-y-4">
          {showConfidence && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Confidence</label>
                <span className="text-sm text-neutral-500">
                  {(confidence * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence * 100}
                onChange={(e) => setConfidence(parseInt(e.target.value) / 100)}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium">Labels</div>
            {renderLabels()}
          </div>

          {variant === 'detailed' && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Comment</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className={`
                  w-full p-2 rounded-lg border resize-none
                  ${isDark 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-neutral-200'}
                `}
                rows={3}
              />
            </div>
          )}

          {showHistory && history.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">History</div>
              <div className={`
                space-y-2 rounded-lg p-3
                ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
              `}>

{history.slice(-5).map((action, idx) => {
  const label = labels.find(l => l.id === action.labelId);
  return (
    <div 
      key={idx}
      className="flex items-center justify-between text-sm"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: label?.color }}
        />
        <span>{label?.name}</span>
        <span className="text-neutral-500">
          {action.action === 'add' ? 'added' : 'removed'}
        </span>
      </div>
      <span className="text-neutral-500">
        {new Date(action.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
})}
</div>
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
Use keyboard shortcuts for quick labeling. Navigate with arrow keys.
Press Ctrl+Z to undo and Ctrl+Y to redo.
{multiLabel && ' Multiple labels can be assigned to each item.'}
</div>
</div>
</div>
)}
</div>
);
};

export default AnnotationTool;