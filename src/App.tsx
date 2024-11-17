// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages'
import { TrainingProgressShowcase } from './components/training'
import { ModelMetricsShowcase } from './components/metrics'
import { DatasetPreviewShowcase } from './components/dataset'
import { ConfusionMatrixShowcase } from './components/confusionmatrix'
import { ROCCurveShowcase } from './components/roccurve'
import { PRCurveShowcase } from './components/prcurve'
import { ClassificationReportShowcase } from './components/classificationreport'
import { FeatureImportanceShowcase } from './components/featureimportance'
import { LearningCurvesShowcase } from './components/learningcurves'
import { LayerActivationsShowcase } from './components/layeractivations'
import { GradientFlowShowcase } from './components/gradientflow'
import { ResourceMonitorShowcase } from './components/resourcemonitor'
import { DataQualityCheckShowcase } from './components/dataqualitycheck'
import DriftDetectorShowcase from './components/driftdetector/DriftDetectorShowcase'
import { AnnotationToolShowcase } from './components/annotationtool'
import { LossLandscapeShowcase } from './components/losslandscape'
import DatasetStatistics from './components/datasetstatistics/DatasetStatistics'
import { DatasetStatisticsShowcase } from './components/datasetstatistics'
import { ShapVisualizationShowcase } from './components/shapvisualization'
import { PDPVisualizationShowcase } from './components/pdpvisualization'
import { ICEVisualizationShowcase } from './components/icevisualization'
import { TimeSeriesVisualizationShowcase } from './components/timeseriesvisualization'
import Documentation from './components/documentation/Documentation'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <LandingPage />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <h2 className="text-2xl font-mono font-medium mb-12">Components</h2>
              <TrainingProgressShowcase/>
              <ModelMetricsShowcase/>
              <DatasetPreviewShowcase/>
              <ConfusionMatrixShowcase/>
              <ROCCurveShowcase/>
              <PRCurveShowcase/>
              <ClassificationReportShowcase/>
              <FeatureImportanceShowcase/>
              <LearningCurvesShowcase/>
              <LayerActivationsShowcase/>
              <GradientFlowShowcase/>
              <ResourceMonitorShowcase/>
              <DataQualityCheckShowcase/>
              <DriftDetectorShowcase/>
              <AnnotationToolShowcase/>
              <LossLandscapeShowcase/>
              <DatasetStatisticsShowcase/>
              <ShapVisualizationShowcase/>
              <PDPVisualizationShowcase/>
              <ICEVisualizationShowcase/>
              <TimeSeriesVisualizationShowcase/>

              {/* <Documentation/> */}

              
              
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App