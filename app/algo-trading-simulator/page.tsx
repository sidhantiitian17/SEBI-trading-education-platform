import { AlgoTradingSimulator } from '@/components/algo-trading-simulator';

export default function AlgoTradingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Algorithmic Trading Simulator</h1>
          <p className="text-lg text-muted-foreground">
            Test and learn different algorithmic trading strategies with historical data.
            Backtest your strategies and analyze performance metrics to understand
            how algorithms perform in various market conditions.
          </p>
        </div>

        <AlgoTradingSimulator />
      </div>
    </div>
  );
}
