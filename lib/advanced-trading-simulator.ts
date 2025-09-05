/**
 * Advanced Trading Simulator Implementation
 * Professional-grade trading simulation with real market conditions
 */

import {
  TickData,
  BidAskData,
  MarketDepthData,
  VolumeProfileData,
  IndexData,
  SectorData,
  VolatilityData,
  OrderResult,
  Position,
  Portfolio,
  PerformanceData,
  ComparisonData,
  RiskAdjustedReturns,
  AttributionData
} from './trading-simulator-types';

export class AdvancedTradingSimulator {
  private marketData: Map<string, TickData[]> = new Map();
  private positions: Map<string, Position> = new Map();
  private orderHistory: OrderResult[] = [];
  private portfolio: Portfolio = {
    positions: [],
    cash: 100000, // Starting cash
    totalValue: 100000,
    dayChange: 0,
    dayChangePercent: 0,
    timestamp: new Date()
  };

  // Mock real-time market data (15-20 minute delay simulation)
  private async fetchRealTimeData(symbol: string): Promise<TickData> {
    // Simulate API call to real market data provider
    const basePrice = this.getBasePrice(symbol);
    const volatility = 0.02; // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * volatility * basePrice;

    const tickData: TickData = {
      symbol,
      price: basePrice + randomChange,
      volume: Math.floor(Math.random() * 10000) + 1000,
      timestamp: new Date(),
      bid: basePrice + randomChange - 0.01,
      ask: basePrice + randomChange + 0.01,
      bidSize: Math.floor(Math.random() * 100) + 10,
      askSize: Math.floor(Math.random() * 100) + 10
    };

    // Store in market data history
    const symbolData = this.marketData.get(symbol) || [];
    symbolData.push(tickData);
    if (symbolData.length > 1000) symbolData.shift(); // Keep last 1000 ticks
    this.marketData.set(symbol, symbolData);

    return tickData;
  }

  // Get market depth data
  async getMarketDepth(symbol: string): Promise<MarketDepthData> {
    const currentPrice = await this.getCurrentPrice(symbol);

    const bids = [];
    const asks = [];

    // Generate realistic bid/ask ladder
    for (let i = 1; i <= 10; i++) {
      bids.push({
        price: currentPrice - (i * 0.01),
        size: Math.floor(Math.random() * 1000) + 100,
        orders: Math.floor(Math.random() * 5) + 1
      });

      asks.push({
        price: currentPrice + (i * 0.01),
        size: Math.floor(Math.random() * 1000) + 100,
        orders: Math.floor(Math.random() * 5) + 1
      });
    }

    return {
      symbol,
      bids,
      asks,
      timestamp: new Date()
    };
  }

  // Get volume profile
  async getVolumeProfile(symbol: string): Promise<VolumeProfileData[]> {
    const symbolData = this.marketData.get(symbol) || [];
    const priceLevels = new Map<number, number>();

    // Aggregate volume by price levels
    symbolData.forEach(tick => {
      const priceLevel = Math.round(tick.price * 100) / 100; // Round to 2 decimal places
      priceLevels.set(priceLevel, (priceLevels.get(priceLevel) || 0) + tick.volume);
    });

    const totalVolume = Array.from(priceLevels.values()).reduce((sum, vol) => sum + vol, 0);

    return Array.from(priceLevels.entries()).map(([price, volume]) => ({
      symbol,
      price,
      volume,
      volumePercentage: (volume / totalVolume) * 100,
      priceLevel: price
    })).sort((a, b) => b.volume - a.volume);
  }

  // Execute market order
  async executeMarketOrder(
    symbol: string,
    quantity: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult> {
    const currentPrice = await this.getCurrentPrice(symbol);
    const slippage = this.calculateSlippage(symbol, quantity);
    const executedPrice = side === 'buy' ?
      currentPrice + slippage :
      currentPrice - slippage;

    const orderResult: OrderResult = {
      orderId: `order-${Date.now()}`,
      status: 'filled',
      executedQuantity: quantity,
      executedPrice,
      remainingQuantity: 0,
      timestamp: new Date(),
      fees: this.calculateFees(quantity, executedPrice),
      slippage
    };

    this.orderHistory.push(orderResult);
    await this.updatePosition(symbol, quantity, executedPrice, side);

    return orderResult;
  }

  // Execute limit order
  async executeLimitOrder(
    symbol: string,
    quantity: number,
    limitPrice: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult> {
    const currentPrice = await this.getCurrentPrice(symbol);

    // Check if limit order can be executed
    const canExecute = side === 'buy' ?
      currentPrice <= limitPrice :
      currentPrice >= limitPrice;

    if (!canExecute) {
      return {
        orderId: `order-${Date.now()}`,
        status: 'pending',
        executedQuantity: 0,
        executedPrice: 0,
        remainingQuantity: quantity,
        timestamp: new Date(),
        fees: 0,
        slippage: 0
      };
    }

    return this.executeMarketOrder(symbol, quantity, side);
  }

  // Execute stop loss order
  async executeStopLossOrder(
    symbol: string,
    quantity: number,
    stopPrice: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult> {
    const currentPrice = await this.getCurrentPrice(symbol);

    // Check if stop price is hit
    const stopHit = side === 'buy' ?
      currentPrice >= stopPrice :
      currentPrice <= stopPrice;

    if (!stopHit) {
      return {
        orderId: `order-${Date.now()}`,
        status: 'pending',
        executedQuantity: 0,
        executedPrice: 0,
        remainingQuantity: quantity,
        timestamp: new Date(),
        fees: 0,
        slippage: 0
      };
    }

    return this.executeMarketOrder(symbol, quantity, side);
  }

  // Execute bracket order
  async executeBracketOrder(
    symbol: string,
    quantity: number,
    entryPrice: number,
    stopLossPrice: number,
    targetPrice: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult> {
    // First execute the entry order
    const entryResult = await this.executeLimitOrder(symbol, quantity, entryPrice, side);

    if (entryResult.status === 'filled') {
      // Place stop loss and target orders
      await this.executeStopLossOrder(symbol, quantity, stopLossPrice, side === 'buy' ? 'sell' : 'buy');
      await this.executeLimitOrder(symbol, quantity, targetPrice, side === 'buy' ? 'sell' : 'buy');
    }

    return entryResult;
  }

  // Get current portfolio
  async getPortfolio(): Promise<Portfolio> {
    // Update portfolio value with current prices
    let totalValue = this.portfolio.cash;

    for (const position of this.portfolio.positions) {
      const currentPrice = await this.getCurrentPrice(position.symbol);
      position.currentPrice = currentPrice;
      position.marketValue = position.quantity * currentPrice;
      position.unrealizedPnL = position.marketValue - (position.quantity * position.averagePrice);
      position.unrealizedPnLPercent = (position.unrealizedPnL / (position.quantity * position.averagePrice)) * 100;
      totalValue += position.marketValue;
    }

    this.portfolio.totalValue = totalValue;
    this.portfolio.timestamp = new Date();

    return this.portfolio;
  }

  // Calculate risk metrics
  async calculateVaR(confidence: number = 0.95, timeframe: number = 1): Promise<number> {
    const portfolio = await this.getPortfolio();
    const positions = portfolio.positions;

    if (positions.length === 0) return 0;

    // Simplified VaR calculation using historical simulation
    const returns: number[] = [];

    // Generate return scenarios based on historical data
    for (let i = 0; i < 1000; i++) {
      let portfolioReturn = 0;
      for (const position of positions) {
        const symbolData = this.marketData.get(position.symbol) || [];
        if (symbolData.length > 1) {
          const recentReturns = symbolData.slice(-30).map((tick, index, arr) => {
            if (index === 0) return 0;
            return (tick.price - arr[index - 1].price) / arr[index - 1].price;
          }).filter(r => r !== 0);

          if (recentReturns.length > 0) {
            const randomReturn = recentReturns[Math.floor(Math.random() * recentReturns.length)];
            portfolioReturn += randomReturn * (position.marketValue / portfolio.totalValue);
          }
        }
      }
      returns.push(portfolioReturn);
    }

    returns.sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * returns.length);

    return -returns[index] * portfolio.totalValue;
  }

  // Calculate Sharpe ratio
  async calculateSharpeRatio(): Promise<number> {
    const portfolio = await this.getPortfolio();

    // Simplified Sharpe ratio calculation
    // In a real implementation, you'd use historical returns and risk-free rate
    const volatility = await this.calculatePortfolioVolatility();
    const avgReturn = 0.08; // Assume 8% annual return
    const riskFreeRate = 0.03; // Assume 3% risk-free rate

    return (avgReturn - riskFreeRate) / volatility;
  }

  // Get portfolio performance
  async getPortfolioPerformance(timeframe: string): Promise<PerformanceData> {
    const portfolio = await this.getPortfolio();

    // Mock performance data - in real implementation, calculate from historical data
    return {
      totalReturn: 0.12, // 12% total return
      annualizedReturn: 0.08, // 8% annualized
      volatility: 0.15, // 15% volatility
      maxDrawdown: -0.08, // -8% max drawdown
      sharpeRatio: 1.2,
      sortinoRatio: 1.5,
      calmarRatio: 1.0
    };
  }

  // Helper methods
  private getBasePrice(symbol: string): number {
    // Mock base prices for common stocks
    const basePrices: Record<string, number> = {
      'AAPL': 150,
      'GOOGL': 2800,
      'MSFT': 300,
      'TSLA': 250,
      'AMZN': 3200,
      'NVDA': 450,
      'META': 330,
      'NFLX': 400,
      'BABA': 85,
      'TCS.NS': 3200,
      'INFY.NS': 1450,
      'RELIANCE.NS': 2500,
      'HDFC.NS': 1650,
      'ICICIBANK.NS': 950
    };

    return basePrices[symbol] || 100;
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    const tickData = await this.fetchRealTimeData(symbol);
    return tickData.price;
  }

  private calculateSlippage(symbol: string, quantity: number): number {
    // Simulate slippage based on order size and market conditions
    const baseSlippage = 0.005; // 0.5% base slippage
    const sizeMultiplier = Math.min(quantity / 1000, 5); // Max 5x multiplier
    return baseSlippage * (1 + sizeMultiplier * Math.random());
  }

  private calculateFees(quantity: number, price: number): number {
    const value = quantity * price;
    return Math.max(value * 0.0005, 0.01); // 0.05% or minimum $0.01
  }

  private async updatePosition(
    symbol: string,
    quantity: number,
    price: number,
    side: 'buy' | 'sell'
  ): Promise<void> {
    const existingPosition = this.positions.get(symbol);

    if (side === 'buy') {
      if (existingPosition) {
        const totalQuantity = existingPosition.quantity + quantity;
        const totalCost = (existingPosition.quantity * existingPosition.averagePrice) + (quantity * price);
        existingPosition.averagePrice = totalCost / totalQuantity;
        existingPosition.quantity = totalQuantity;
      } else {
        this.positions.set(symbol, {
          symbol,
          quantity,
          averagePrice: price,
          currentPrice: price,
          marketValue: quantity * price,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          timestamp: new Date()
        });
      }
      this.portfolio.cash -= (quantity * price);
    } else {
      if (existingPosition) {
        existingPosition.quantity -= quantity;
        if (existingPosition.quantity <= 0) {
          this.positions.delete(symbol);
        }
      }
      this.portfolio.cash += (quantity * price);
    }

    // Update portfolio positions array
    this.portfolio.positions = Array.from(this.positions.values());
  }

  private async calculatePortfolioVolatility(): Promise<number> {
    // Simplified volatility calculation
    const portfolio = await this.getPortfolio();
    const positions = portfolio.positions;

    if (positions.length === 0) return 0;

    let totalVolatility = 0;
    for (const position of positions) {
      const symbolData = this.marketData.get(position.symbol) || [];
      if (symbolData.length > 1) {
        const returns = symbolData.slice(-30).map((tick, index, arr) => {
          if (index === 0) return 0;
          return (tick.price - arr[index - 1].price) / arr[index - 1].price;
        }).filter(r => r !== 0);

        if (returns.length > 0) {
          const volatility = this.calculateStandardDeviation(returns);
          totalVolatility += volatility * (position.marketValue / portfolio.totalValue);
        }
      }
    }

    return totalVolatility;
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  }
}

// Export singleton instance
export const advancedTradingSimulator = new AdvancedTradingSimulator();
