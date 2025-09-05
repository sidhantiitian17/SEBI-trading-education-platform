'use client';

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface TradeChartAnimationProps {
  className?: string
}

// Fallback component for SSR
const FallbackBackground = ({ className = '' }: { className?: string }) => (
  <div className={`fixed inset-0 -z-10 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
  </div>
)

// Client-only Three.js components with proper dynamic loading
const ClientOnlyThreeComponents = dynamic(
  () => import('./three-components'),
  { 
    ssr: false,
    loading: () => null
  }
)

export default function TradeChartAnimation({ className = '' }: TradeChartAnimationProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render Three.js on server or if there's an error
  if (!isClient || hasError || typeof window === 'undefined') {
    return <FallbackBackground className={className} />
  }

  try {
    return (
      <div className={`fixed inset-0 -z-10 ${className}`}>
        <ClientOnlyThreeComponents />
      </div>
    )
  } catch (error) {
    console.warn('Three.js animation failed to load:', error)
    setHasError(true)
    return <FallbackBackground className={className} />
  }
}
