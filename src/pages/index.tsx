// src/components/LandingPage.tsx

import { 
  ExternalLink, 
  BarChart, 
  Brain,
  Code,
  Database,
  GitFork,
  LineChart,
  Box,
  Network,
  Gauge,
  Sparkles,
  ChevronRight
} from 'lucide-react';

// Quick demo components
import { ModelMetrics } from '../components/metrics/ModelMetrics';
import TrainingProgress from '../components/training/TrainingProgress';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-cyan-700" />
              <span className="font-mono font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-800">
                MLFramework
              </span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-cyan-700">Features</a>
              <a href="#components" className="text-sm hover:text-cyan-700">Components</a>
              <a href="#quickstart" className="text-sm hover:text-cyan-700">Usage</a>
              <a href="https://github.com/michaelbinary/MLUIFramework" 
                className="inline-flex items-center gap-2 text-sm bg-slate-100 px-4 py-2 rounded-md hover:bg-slate-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero with Quick Demo */}
      <section className="pt-32 pb-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-md text-sm text-cyan-700 mb-6">
                <Sparkles className="h-4 w-4" />
                Enterprise-Grade ML Tools
              </div>
              <h1 className="text-5xl font-mono font-medium leading-tight">
                React Components for{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-800">
                  Machine Learning Applications
                </span>
              </h1>
              <p className="mt-6 text-slate-600 text-lg leading-relaxed">
                A comprehensive React UI framework designed specifically for building ML model monitoring, training visualization, and dataset exploration applications.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <a 
                  href="#components"
                  className="px-8 py-3 bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-md hover:opacity-90 shadow-lg shadow-cyan-900/10"
                >
                  View Components
                </a>
                <a 
                  href="#quickstart"
                  className="px-8 py-3 bg-white text-cyan-700 rounded-md hover:bg-slate-50 border border-slate-200"
                >
                  Quick Start
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-cyan-900 rounded-lg p-8 shadow-2xl">
              <div className="space-y-6">
                <ModelMetrics 
                  metrics={{
                    accuracy: 0.945,
                    precision: 0.923,
                    recall: 0.912,
                    f1Score: 0.917
                  }}
                />
                <TrainingProgress 
                  epoch={45}
                  loss={0.234}
                  accuracy={0.918}
                  learningRate={0.001}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-mono font-medium text-center mb-16">Framework Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Box,
                title: "35+ ML Components",
                description: "Comprehensive set of components for model metrics, training visualization, and data exploration"
              },
              {
                icon: Gauge,
                title: "Real-time Updates",
                description: "Built for live training monitoring and real-time model inference visualization"
              },
              {
                icon: Brain,
                title: "Production Ready",
                description: "Battle-tested components used in ML production environments"
              },
              {
                icon: Code,
                title: "Type Safe",
                description: "Full TypeScript support with comprehensive type definitions"
              },
              {
                icon: GitFork,
                title: "Customizable",
                description: "Highly customizable with support for light/dark themes and variants"
              },
              {
                icon: Network,
                title: "Framework Agnostic",
                description: "Works with any ML framework - PyTorch, TensorFlow, or custom solutions"
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-lg border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <feature.icon className="h-6 w-6 mb-4 text-cyan-700" />
                <h3 className="font-mono text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage & Quick Start */}
      <section id="quickstart" className="py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-mono font-medium text-center mb-8">Usage & Quick Start</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-lg mb-3">1. Installation</h3>
                <div className="bg-gradient-to-r from-slate-800 to-cyan-900 rounded-lg p-4">
                  <code className="text-sm text-slate-200 font-mono">npm install mlframework</code>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-lg mb-3">2. Import Components</h3>
                <div className="bg-gradient-to-r from-slate-800 to-cyan-900 rounded-lg p-4">
                  <code className="text-sm text-slate-200 font-mono">
                    {`import { ModelMetrics, TrainingProgress } from 'mlframework'`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-lg mb-3">3. Use in Your App</h3>
                <div className="bg-gradient-to-r from-slate-800 to-cyan-900 rounded-lg p-4">
                  <code className="text-sm text-slate-200 font-mono whitespace-pre">
{`<ModelMetrics
  metrics={{
    accuracy: 0.945,
    precision: 0.923,
    recall: 0.912,
    f1Score: 0.917
  }}
/>`}
                  </code>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://github.com/michaelbinary/MLUIFramework"
                  className="text-sm text-slate-600 hover:text-cyan-700 inline-flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub 
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
