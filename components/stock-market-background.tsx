'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js component with SSR disabled
const TradeChartAnimation = dynamic(() => import('./trade-chart-animation'), {
  ssr: false,
  loading: () => null
});

const StockMarketBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Three.js Trade Chart Animation Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80" />
      }>
        <TradeChartAnimation />
      </Suspense>

      {/* Overlay with market-themed gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80" />

      {/* Floating market indicators */}
      <div className="absolute top-20 left-10 animate-bounce">
        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
          <div className="text-green-400 text-sm font-medium">📈 BULL</div>
        </div>
      </div>

      <div className="absolute top-40 right-20 animate-pulse">
        <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
          <div className="text-blue-400 text-sm font-medium">💎 DIAMOND</div>
        </div>
      </div>

      <div className="absolute bottom-32 left-20 animate-bounce" style={{ animationDelay: '1s' }}>
        <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
          <div className="text-purple-400 text-sm font-medium">🚀 MOON</div>
        </div>
      </div>

      <div className="absolute bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }}>
        <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-3 border border-orange-500/30">
          <div className="text-orange-400 text-sm font-medium">📊 CHART</div>
        </div>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default StockMarketBackground;
