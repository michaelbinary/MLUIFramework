// src/components/docs/Layout.tsx
import React from 'react'
import { Menu, X } from 'lucide-react'

interface NavItem {
  title: string
  href: string
}

const components: NavItem[] = [
  { title: 'Tickers', href: '/docs/components/tickers' },
  { title: 'Charts', href: '/docs/components/charts' },
  { title: 'Order Books', href: '/docs/components/order-books' },
]

const DocsLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <a href="/" className="text-lg font-mono font-bold ml-3">Trading Framework</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="fixed top-14 h-[calc(100vh-3.5rem)] w-64 border-r border-neutral-200 bg-white overflow-y-auto lg:block"
           style={{ display: isSidebarOpen ? 'block' : 'none' }}>
        <div className="p-4">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold mb-2">Getting Started</h4>
              <div className="space-y-1">
                <a href="/docs" className="block text-sm text-neutral-600 hover:text-neutral-900">Introduction</a>
                <a href="/docs/installation" className="block text-sm text-neutral-600 hover:text-neutral-900">Installation</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Components</h4>
              <div className="space-y-1">
                {components.map((item) => (
                  <a 
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DocsLayout