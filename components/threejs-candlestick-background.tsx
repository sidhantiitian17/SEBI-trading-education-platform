"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Individual candlestick component
function Candlestick({ position, data, delay = 0 }: {
  position: [number, number, number];
  data: { open: number; high: number; low: number; close: number };
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0);
  
  const isGreen = data.close > data.open;
  const bodyHeight = Math.abs(data.close - data.open);
  const wickTop = data.high;
  const wickBottom = data.low;
  const bodyTop = Math.max(data.open, data.close);
  const bodyBottom = Math.min(data.open, data.close);

  useFrame((state) => {
    if (groupRef.current) {
      // Animate entrance with delay
      const time = state.clock.getElapsedTime();
      if (time > delay) {
        setScale(Math.min((time - delay) * 2, 1));
        groupRef.current.scale.setScalar(scale);
        
        // Add floating animation
        groupRef.current.position.y = position[1] + Math.sin(time * 2 + delay) * 0.02;
        groupRef.current.rotation.y = Math.sin(time + delay) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Wick (line) */}
      <mesh position={[0, (wickTop + wickBottom) / 2, 0]}>
        <cylinderGeometry args={[0.002, 0.002, wickTop - wickBottom, 8]} />
        <meshStandardMaterial color={isGreen ? "#10b981" : "#ef4444"} />
      </mesh>
      
      {/* Body (rectangle) */}
      <mesh position={[0, (bodyTop + bodyBottom) / 2, 0]}>
        <boxGeometry args={[0.08, bodyHeight, 0.08]} />
        <meshStandardMaterial
          color={isGreen ? "#10b981" : "#ef4444"}
          transparent
          opacity={0.8}
          emissive={isGreen ? "#065f46" : "#7f1d1d"}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Glowing effect */}
      <mesh position={[0, (bodyTop + bodyBottom) / 2, 0]}>
        <boxGeometry args={[0.12, bodyHeight + 0.02, 0.12]} />
        <meshStandardMaterial
          color={isGreen ? "#10b981" : "#ef4444"}
          transparent
          opacity={0.2}
          emissive={isGreen ? "#065f46" : "#7f1d1d"}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Animated chart component
function AnimatedChart() {
  const groupRef = useRef<THREE.Group>(null);
  const [candlesticks, setCandlesticks] = useState<Array<{
    open: number;
    high: number;
    low: number;
    close: number;
  }>>([]);

  // Generate realistic candlestick data
  const generateCandlestickData = () => {
    const data = [];
    let basePrice = 100;
    
    for (let i = 0; i < 20; i++) {
      const volatility = 0.03;
      const trend = Math.sin(i * 0.3) * 0.01;
      
      const open = basePrice;
      const change = (Math.random() - 0.5) * volatility * basePrice + trend * basePrice;
      const close = Math.max(open + change, basePrice * 0.8);
      
      const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;
      
      data.push({
        open: open / 100,
        high: high / 100,
        low: low / 100,
        close: close / 100
      });
      
      basePrice = close;
    }
    
    return data;
  };

  useEffect(() => {
    setCandlesticks(generateCandlestickData());
    
    // Regenerate data periodically for dynamic effect
    const interval = setInterval(() => {
      setCandlesticks(generateCandlestickData());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {candlesticks.map((candle, index) => (
        <Candlestick
          key={index}
          position={[(index - 10) * 0.15, 0, 0]}
          data={candle}
          delay={index * 0.1}
        />
      ))}
      
      {/* Grid lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`grid-${i}`} position={[0, (i - 2) * 0.3, -0.5]}>
          <planeGeometry args={[3, 0.002]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// Floating particles for extra visual appeal
function FloatingParticles() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 100;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const color = Math.random() > 0.5 ? new THREE.Color("#10b981") : new THREE.Color("#3b82f6");
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      points.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} vertexColors transparent opacity={0.6} />
    </points>
  );
}

// Main Three.js scene component
export function ThreeJSCandlestickBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#10b981" />
        
        {/* Main animated chart */}
        <AnimatedChart />
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* 3D Text */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          StockLearn
        </Text>
        
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.08}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Interactive Stock Market Learning
        </Text>
        
        {/* Subtle camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Alternative simpler CSS-based candlestick animation for fallback
export function CSSCandlestickAnimation() {
  const [candlesticks, setCandlesticks] = useState<Array<{
    height: number;
    isGreen: boolean;
    delay: number;
  }>>([]);

  useEffect(() => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      height: Math.random() * 60 + 20,
      isGreen: Math.random() > 0.5,
      delay: i * 0.2
    }));
    setCandlesticks(data);
    
    // Animate new data periodically
    const interval = setInterval(() => {
      const newData = Array.from({ length: 12 }, (_, i) => ({
        height: Math.random() * 60 + 20,
        isGreen: Math.random() > 0.5,
        delay: i * 0.1
      }));
      setCandlesticks(newData);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-30">
      {/* Floating particles background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Candlestick chart */}
      <div className="flex items-end justify-center h-full space-x-2 px-8">
        {candlesticks.map((candle, index) => (
          <div
            key={index}
            className={`w-3 rounded-t-sm transition-all duration-1000 ease-out transform ${
              candle.isGreen ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'
            } shadow-lg`}
            style={{
              height: `${candle.height}%`,
              animationDelay: `${candle.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white/10"
            style={{ top: `${20 + i * 15}%` }}
          />
        ))}
      </div>
      
      {/* Market trend line */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d="M 0,200 Q 200,150 400,180 T 800,160"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          className="animate-draw-path"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
        
        @keyframes draw-path {
          0% {
            stroke-dasharray: 0 1000;
          }
          100% {
            stroke-dasharray: 1000 0;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-draw-path {
          stroke-dasharray: 1000;
          animation: draw-path 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
