"use client";

import { useEffect, useState } from 'react';

// Pure CSS-based animated candlestick chart with financial data simulation
export function AnimatedCandlestickBackground() {
  const [candlesticks, setCandlesticks] = useState<Array<{
    height: number;
    isGreen: boolean;
    delay: number;
    id: number;
  }>>([]);

  useEffect(() => {
    // Generate initial candlestick data
    const generateData = () => {
      return Array.from({ length: 15 }, (_, i) => ({
        height: Math.random() * 70 + 15,
        isGreen: Math.random() > 0.45, // Slightly favor green for positive feeling
        delay: i * 0.15,
        id: Math.random()
      }));
    };

    setCandlesticks(generateData());
    
    // Update candlesticks periodically for dynamic effect
    const interval = setInterval(() => {
      setCandlesticks(generateData());
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-indigo-900/90 animate-gradient-shift" />
      
      {/* Floating financial particles */}
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#10b981' : '#8b5cf6',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Main candlestick chart */}
      <div className="absolute inset-0 flex items-end justify-center pb-20">
        <div className="flex items-end space-x-1 sm:space-x-2">
          {candlesticks.map((candle, index) => (
            <div
              key={candle.id}
              className="relative group"
              style={{
                animationDelay: `${candle.delay}s`,
              }}
            >
              {/* Candlestick body */}
              <div
                className={`w-2 sm:w-3 rounded-t-sm transition-all duration-1000 ease-out transform hover:scale-110 ${
                  candle.isGreen 
                    ? 'bg-green-500 shadow-green-500/50 shadow-lg' 
                    : 'bg-red-500 shadow-red-500/50 shadow-lg'
                } animate-grow-candlestick`}
                style={{
                  height: `${candle.height}%`,
                  animationDelay: `${candle.delay}s`,
                }}
              />
              
              {/* Candlestick wick (top line) */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-px ${
                  candle.isGreen ? 'bg-green-400' : 'bg-red-400'
                } animate-fade-in`}
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  top: `-${Math.random() * 15 + 5}px`,
                  animationDelay: `${candle.delay + 0.3}s`,
                }}
              />
              
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-t-sm opacity-30 ${
                  candle.isGreen ? 'bg-green-400' : 'bg-red-400'
                } blur-sm animate-pulse`}
                style={{
                  animationDelay: `${candle.delay + 0.5}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Grid lines for professional chart appearance */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white/30 animate-fade-in"
            style={{ 
              top: `${15 + i * 12}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-white/20 animate-fade-in"
            style={{ 
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 0.1 + 1}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated trend line */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        <path
          d="M 50,300 Q 150,250 250,280 T 450,260 T 650,240 T 850,220"
          fill="none"
          stroke="url(#trendGradient)"
          strokeWidth="2"
          className="animate-draw-trend"
        />
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Market indicators */}
      <div className="absolute top-10 left-10 opacity-50">
        <div className="text-green-400 text-xs font-mono animate-pulse">
          ↗ +2.4% SPY
        </div>
        <div className="text-blue-400 text-xs font-mono animate-pulse" style={{ animationDelay: '0.5s' }}>
          ↗ +1.8% QQQ
        </div>
        <div className="text-yellow-400 text-xs font-mono animate-pulse" style={{ animationDelay: '1s' }}>
          → +0.3% IWM
        </div>
      </div>
      
      <style jsx>{`
        @keyframes grow-candlestick {
          0% {
            height: 0%;
            opacity: 0;
            transform: scaleY(0);
          }
          50% {
            opacity: 0.7;
          }
          100% {
            height: var(--final-height);
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        @keyframes float-0 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-15px) translateX(5px) rotate(90deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-25px) translateX(-5px) rotate(180deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-15px) translateX(5px) rotate(270deg);
            opacity: 0.7;
          }
        }
        
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.4;
          }
          33% {
            transform: translateY(-20px) translateX(-10px) rotate(120deg);
            opacity: 0.8;
          }
          66% {
            transform: translateY(-10px) translateX(10px) rotate(240deg);
            opacity: 0.6;
          }
        }
        
        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) translateX(0px) rotate(180deg);
            opacity: 0.9;
          }
        }
        
        @keyframes draw-trend {
          0% {
            stroke-dasharray: 0 1000;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            stroke-dasharray: 1000 0;
            opacity: 0.6;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-grow-candlestick {
          animation: grow-candlestick 1.5s ease-out forwards;
        }
        
        .animate-float-0 {
          animation: float-0 6s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 7s ease-in-out infinite;
        }
        
        .animate-draw-trend {
          stroke-dasharray: 1000;
          animation: draw-trend 12s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
    </div>
  );
}
