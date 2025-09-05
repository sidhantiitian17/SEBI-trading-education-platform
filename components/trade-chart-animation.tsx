'use client';

import React, { useState, useEffect, Suspense } from 'react'

interface TradeChartAnimationProps {
  className?: string
}

// Fallback component for SSR and loading states
const FallbackBackground = ({ className = '' }: { className?: string }) => (
  <div className={`fixed inset-0 -z-10 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
  </div>
)

// Safe Three.js component with inline implementation
const SafeThreeComponent = () => {
  const [isClient, setIsClient] = useState(false)
  const [ThreeCanvas, setThreeCanvas] = useState<React.ComponentType | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== 'undefined') {
      // Dynamic import Three.js modules
      Promise.all([
        import('@react-three/fiber'),
        import('@react-three/drei'),
        import('three')
      ]).then(([fiber, drei, three]) => {
        const { Canvas, useFrame } = fiber
        const { Points, PointMaterial } = drei

        // Create the Three.js component
        const ThreeCanvasComponent = React.memo(() => {
          const pointsRef = React.useRef<any>(null)
          const particlesRef = React.useRef<any>(null)

          // Generate static data
          const candlestickPositions = React.useMemo(() => {
            const positions = new Float32Array(300 * 3)
            for (let i = 0; i < 100; i++) {
              const x = (i - 50) * 0.2
              const baseY = Math.sin(i * 0.1) * 2 + Math.random() * 0.5
              const height = Math.random() * 1.5 + 0.5

              positions[i * 9] = x
              positions[i * 9 + 1] = baseY + height
              positions[i * 9 + 2] = 0
              positions[i * 9 + 3] = x
              positions[i * 9 + 4] = baseY + height * 0.6
              positions[i * 9 + 5] = 0
              positions[i * 9 + 6] = x
              positions[i * 9 + 7] = baseY
              positions[i * 9 + 8] = 0
            }
            return positions
          }, [])

          const particlePositions = React.useMemo(() => {
            const positions = new Float32Array(200 * 3)
            for (let i = 0; i < 200; i++) {
              positions[i * 3] = (Math.random() - 0.5) * 20
              positions[i * 3 + 1] = (Math.random() - 0.5) * 20
              positions[i * 3 + 2] = (Math.random() - 0.5) * 20
            }
            return positions
          }, [])

          // Animation
          useFrame((state) => {
            if (pointsRef.current) {
              pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
            }
            if (particlesRef.current) {
              particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05
              particlesRef.current.rotation.y = state.clock.elapsedTime * 0.075
            }
          })

          return (
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: 'transparent' }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              
              <Points ref={pointsRef} positions={candlestickPositions} stride={3} frustumCulled={false}>
                <PointMaterial
                  transparent
                  color="#00ff88"
                  size={0.05}
                  sizeAttenuation={true}
                  depthWrite={false}
                />
              </Points>

              <Points ref={particlesRef} positions={particlePositions} stride={3} frustumCulled={false}>
                <PointMaterial
                  transparent
                  color="#4f46e5"
                  size={0.02}
                  sizeAttenuation={true}
                  depthWrite={false}
                  opacity={0.6}
                />
              </Points>
            </Canvas>
          )
        })

        setThreeCanvas(() => ThreeCanvasComponent)

      }).catch((error) => {
        console.warn('Failed to load Three.js:', error)
        setHasError(true)
      })
    }
  }, [])

  if (!isClient || typeof window === 'undefined' || hasError || !ThreeCanvas) {
    return null
  }

  try {
    return <ThreeCanvas />
  } catch (error) {
    console.warn('Three.js render error:', error)
    return null
  }
}

export default function TradeChartAnimation({ className = '' }: TradeChartAnimationProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Always show fallback on server or if not ready
  if (!isClient || typeof window === 'undefined') {
    return <FallbackBackground className={className} />
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Suspense fallback={<FallbackBackground className={className} />}>
        <SafeThreeComponent />
      </Suspense>
    </div>
  )
}
