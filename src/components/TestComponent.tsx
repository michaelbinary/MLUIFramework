// src/components/TestComponent.tsx
import React from 'react'

export const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Test card with Tailwind styles */}
        <div className="ticker-card">
          <h2 className="text-2xl font-bold mb-4">Tailwind is working!</h2>
          
          {/* Test color classes */}
          <div className="space-y-2">
            <p className="price-up">This text should be green (positive)</p>
            <p className="price-down">This text should be red (negative)</p>
            <p className="price-neutral">This text should be blue-gray (neutral)</p>
          </div>
          
          {/* Test hover and transitions */}
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg
                           hover:bg-blue-600 transition-colors duration-200">
            Hover me
          </button>
        </div>
      </div>
    </div>
  )
}