import React from 'react';
import {
  BookOpen,
  Code,
  Box,
  GitFork,
  Terminal,
  Layers,
  Settings,
  Package,
  FileCode,
  Palette,
  Zap
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-cyan-700" />
              <span className="font-mono font-medium">Documentation</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#getting-started" className="text-sm hover:text-cyan-700">Getting Started</a>
              <a href="#components" className="text-sm hover:text-cyan-700">Components</a>
              <a href="#api" className="text-sm hover:text-cyan-700">API Reference</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <h1 className="text-4xl font-mono font-medium mb-6">Documentation</h1>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-600">
              ML Framework is a comprehensive React component library for building machine learning visualization 
              and monitoring applications. It provides a set of high-quality, customizable components for 
              model metrics, training visualization, and dataset exploration.
            </p>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="mb-16">
          <h2 className="text-2xl font-mono font-medium mb-6">Getting Started</h2>
          
          {/* Installation */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Installation
            </h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <code className="text-white">npm install ml-framework</code>
            </div>
          </div>

          {/* Basic Usage */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Basic Usage
            </h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-white">
                {`import { ModelMetrics } from 'ml-framework';

const MyComponent = () => {
  return (
    <ModelMetrics 
      metrics={{
        accuracy: 0.945,
        precision: 0.923,
        recall: 0.912,
        f1Score: 0.917
      }}
    />
  );
}`}
              </pre>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
              <li>React 16.8+</li>
              <li>Tailwind CSS 3.0+</li>
              <li>Modern browser support</li>
            </ul>
          </div>
        </section>

        {/* Component Categories */}
        <section id="components" className="mb-16">
          <h2 className="text-2xl font-mono font-medium mb-6">Component Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Model Metrics */}
            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-700" />
                Model Metrics
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Confusion Matrix</li>
                <li>• ROC & PR Curves</li>
                <li>• Classification Reports</li>
                <li>• Feature Importance</li>
              </ul>
            </div>

            {/* Training Visualization */}
            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-700" />
                Training Visualization
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Learning Curves</li>
                <li>• Loss Landscapes</li>
                <li>• Gradient Flow</li>
                <li>• Layer Activations</li>
              </ul>
            </div>

            {/* Dataset Tools */}
            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Box className="h-5 w-5 text-cyan-700" />
                Dataset Tools
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Dataset Statistics</li>
                <li>• Data Distribution</li>
                <li>• Quality Checks</li>
                <li>• Drift Detection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section id="api" className="mb-16">
          <h2 className="text-2xl font-mono font-medium mb-6">API Reference</h2>
          
          {/* Common Props */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Common Props
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Prop</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Default</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-mono">theme</td>
                    <td className="px-6 py-4 text-sm">'light' | 'dark'</td>
                    <td className="px-6 py-4 text-sm">'light'</td>
                    <td className="px-6 py-4 text-sm">Color theme of the component</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-mono">variant</td>
                    <td className="px-6 py-4 text-sm">'default' | 'compact' | 'detailed'</td>
                    <td className="px-6 py-4 text-sm">'default'</td>
                    <td className="px-6 py-4 text-sm">Display variant of the component</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-mono">colorScale</td>
                    <td className="px-6 py-4 text-sm">'blue' | 'green' | 'purple'</td>
                    <td className="px-6 py-4 text-sm">'blue'</td>
                    <td className="px-6 py-4 text-sm">Color scale for visualizations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Component-Specific APIs */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Component APIs
            </h3>
            
            {/* ModelMetrics */}
            <div className="mb-8">
              <h4 className="font-medium text-lg mb-4">ModelMetrics</h4>
              <div className="prose max-w-none">
                <p className="text-slate-600 mb-4">
                  Component for displaying model performance metrics with various visualization options.
                </p>
                <pre className="bg-slate-900 text-white rounded-lg p-4">
{`interface ModelMetricsProps {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    // ... other metrics
  };
  showConfusionMatrix?: boolean;
  showRocCurve?: boolean;
  // ... other props
}`}
                </pre>
              </div>
            </div>

            {/* Add more component APIs... */}
          </div>
        </section>

        {/* Theme Customization */}
        <section className="mb-16">
          <h2 className="text-2xl font-mono font-medium mb-6 flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Theme Customization
          </h2>
          <div className="prose max-w-none">
            <p className="text-slate-600 mb-4">
              ML Framework components can be customized using Tailwind CSS classes and configuration.
            </p>
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-white">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.cyan,
        secondary: colors.blue,
        // ... custom colors
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-mono font-medium mb-6">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="font-medium mb-4">Performance Optimization</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Use appropriate data sampling for large datasets</li>
                <li>• Implement pagination for long lists</li>
                <li>• Lazy load components when possible</li>
                <li>• Optimize chart re-renders</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="font-medium mb-4">Accessibility</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Provide alt text for visualizations</li>
                <li>• Ensure keyboard navigation</li>
                <li>• Use semantic HTML elements</li>
                <li>• Support screen readers</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Documentation;