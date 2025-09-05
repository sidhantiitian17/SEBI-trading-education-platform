'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react'

// Simple fallback component
const ThreeComponentsFallback = () => null

// Main component that dynamically loads Three.js
function ThreeComponents() {
  const [isClient, setIsClient] = useState(false)
  const [ThreeRenderer, setThreeRenderer] = useState<React.ComponentType | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== 'undefined') {
      // Dynamic import with proper error handling
      Promise.all([
        import('@react-three/fiber'),
        import('@react-three/drei'),
        import('three')
      ]).then(([fiber, drei, three]) => {
        const { Canvas, useFrame } = fiber
        const { Points, PointMaterial } = drei

        // Define the actual Three.js renderer component
        const ActualThreeRenderer = () => {
          const pointsRef = useRef<any>(null)
          const particlesRef = useRef<any>(null)

          // Generate candlestick positions and colors
          const candlestickData = useMemo(() => {
            const positions = new Float32Array(300 * 3) // 100 candles * 3 points * 3 coordinates
            const colors = new Float32Array(300 * 3)

            for (let i = 0; i < 100; i++) {
              const x = (i - 50) * 0.2
              const baseY = Math.sin(i * 0.1) * 2 + Math.random() * 0.5
              const height = Math.random() * 1.5 + 0.5

              // High point
              positions[i * 9] = x
              positions[i * 9 + 1] = baseY + height
              positions[i * 9 + 2] = 0

              // Mid point
              positions[i * 9 + 3] = x
              positions[i * 9 + 4] = baseY + height * 0.6
              positions[i * 9 + 5] = 0

              // Low point
              positions[i * 9 + 6] = x
              positions[i * 9 + 7] = baseY
              positions[i * 9 + 8] = 0

              // Colors (green for up, red for down)
              const isUp = Math.random() > 0.5
              const color = isUp ? [0, 1, 0] : [1, 0, 0]

              for (let j = 0; j < 3; j++) {
                colors[i * 9 + j * 3] = color[0]
                colors[i * 9 + j * 3 + 1] = color[1]
                colors[i * 9 + j * 3 + 2] = color[2]
              }
            }

            return { positions, colors }
          }, [])

          // Generate particle positions
          const particlePositions = useMemo(() => {
            const positions = new Float32Array(200 * 3)
            for (let i = 0; i < 200; i++) {
              positions[i * 3] = (Math.random() - 0.5) * 20
              positions[i * 3 + 1] = (Math.random() - 0.5) * 20
              positions[i * 3 + 2] = (Math.random() - 0.5) * 20
            }
            return positions
          }, [])

          // Animation frame
          useFrame((state) => {
            if (pointsRef.current) {
              pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
              pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            }
            if (particlesRef.current) {
              particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05
              particlesRef.current.rotation.y = state.clock.elapsedTime * 0.075
            }
          })

          return (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              
              {/* Candlestick points */}
              <Points 
                ref={pointsRef} 
                positions={candlestickData.positions} 
                stride={3} 
                frustumCulled={false}
              >
                <PointMaterial
                  transparent
                  color="#00ff88"
                  size={0.05}
                  sizeAttenuation={true}
                  depthWrite={false}
                  vertexColors
                />
              </Points>

              {/* Floating particles */}
              <Points 
                ref={particlesRef} 
                positions={particlePositions} 
                stride={3} 
                frustumCulled={false}
              >
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
        }

        setThreeRenderer(() => ActualThreeRenderer)
        
      }).catch((error) => {
        console.warn('Failed to load Three.js components:', error)
        setHasError(true)
      })
    }
  }, [])

  // Return fallback if not ready or error occurred
  if (!isClient || typeof window === 'undefined' || hasError || !ThreeRenderer) {
    return <ThreeComponentsFallback />
  }

  try {
    return <ThreeRenderer />
  } catch (error) {
    console.warn('Three.js component render error:', error)
    setHasError(true)
    return <ThreeComponentsFallback />
  }
}

export default ThreeComponents

              // Open/Close point
              candlePositions[i * 9 + 3] = x
              candlePositions[i * 9 + 4] = baseY + height * 0.6
              candlePositions[i * 9 + 5] = 0

              // Low point
              candlePositions[i * 9 + 6] = x
              candlePositions[i * 9 + 7] = baseY
              candlePositions[i * 9 + 8] = 0

              // Colors
              const isUp = Math.random() > 0.5
              const color = isUp ? [0, 1, 0] : [1, 0, 0]

              for (let j = 0; j < 3; j++) {
                candleColors[i * 9 + j * 3] = color[0]
                candleColors[i * 9 + j * 3 + 1] = color[1]
                candleColors[i * 9 + j * 3 + 2] = color[2]
              }
            }

            // Generate particle positions
            const particlePositions = new Float32Array(200 * 3)
            for (let i = 0; i < 200; i++) {
              particlePositions[i * 3] = (Math.random() - 0.5) * 20
              particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20
              particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20
            }

            setAnimationData({
              candlePositions,
              candleColors,
              particlePositions
            })
          }, [])

          // Animation hook
          useFrame((state) => {
            if (pointsRef.current && animationData) {
              pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
              pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            }
            if (particlesRef.current && animationData) {
              particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05
              particlesRef.current.rotation.y = state.clock.elapsedTime * 0.075
            }
          })

          if (!animationData) {
            return null
          }

          return (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ background: 'transparent' }}
              onError={(error) => {
                console.warn('Canvas error:', error)
                setLoadError(true)
              }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              
              {/* Candlesticks */}
              <Points 
                ref={pointsRef} 
                positions={animationData.candlePositions} 
                stride={3} 
                frustumCulled={false}
              >
                <PointMaterial
                  transparent
                  color="#00ff88"
                  size={0.05}
                  sizeAttenuation={true}
                  depthWrite={false}
                  vertexColors
                />
              </Points>

              {/* Particles */}
              <Points 
                ref={particlesRef} 
                positions={animationData.particlePositions} 
                stride={3} 
                frustumCulled={false}
              >
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
        }

        setThreeCanvas(() => ThreeCanvasComponent)
        
      }).catch((error) => {
        console.warn('Failed to load Three.js:', error)
        setLoadError(true)
      })
    }
  }, [])

  // Don't render anything on server or if there's an error
  if (!isClient || typeof window === 'undefined' || loadError || !ThreeCanvas) {
    return null
  }

  try {
    return <ThreeCanvas />
  } catch (error) {
    console.warn('Three.js render error:', error)
    return null
  }
}
