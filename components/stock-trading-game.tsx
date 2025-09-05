import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface StockGameProps {
  onComplete?: (score: number) => void
}

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

const mockStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.3, trend: 'up' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.2, trend: 'down' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.90, change: 1.8, trend: 'up' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.60, change: -3.5, trend: 'down' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.20, change: 0.7, trend: 'stable' },
]

export default function StockTradingGame({ onComplete }: StockGameProps) {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks)
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({})
  const [cash, setCash] = useState(10000)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      const finalScore = cash + Object.entries(portfolio).reduce((total, [symbol, shares]) => {
        const stock = stocks.find(s => s.symbol === symbol)
        return total + (stock ? stock.price * shares : 0)
      }, 0)
      setScore(finalScore)
      onComplete?.(finalScore)
    }
  }, [timeLeft, gameStarted, cash, portfolio, stocks, onComplete])

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setStocks(prevStocks =>
          prevStocks.map(stock => ({
            ...stock,
            price: stock.price + (Math.random() - 0.5) * 2,
            change: stock.change + (Math.random() - 0.5) * 0.5,
            trend: Math.random() > 0.5 ? 'up' : 'down'
          }))
        )
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [gameStarted])

  const buyStock = (symbol: string, price: number) => {
    if (cash >= price) {
      setCash(cash - price)
      setPortfolio(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + 1
      }))
    }
  }

  const sellStock = (symbol: string, price: number) => {
    if (portfolio[symbol] && portfolio[symbol] > 0) {
      setCash(cash + price)
      setPortfolio(prev => ({
        ...prev,
        [symbol]: prev[symbol] - 1
      }))
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setTimeLeft(60)
    setCash(10000)
    setPortfolio({})
    setScore(0)
  }

  const currentValue = cash + Object.entries(portfolio).reduce((total, [symbol, shares]) => {
    const stock = stocks.find(s => s.symbol === symbol)
    return total + (stock ? stock.price * shares : 0)
  }, 0)

  if (!gameStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        <h3 className="text-xl font-bold mb-4 text-center">Stock Trading Game</h3>
        <p className="text-muted-foreground mb-4 text-center">
          Test your trading skills! You have 60 seconds to maximize your portfolio.
        </p>
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Starting Cash: $10,000</p>
          <p className="text-sm text-muted-foreground">Goal: Beat your starting amount!</p>
        </div>
        <button
          onClick={startGame}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Start Trading Game
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Stock Trading Game</h3>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Time: {timeLeft}s</p>
          <p className="text-sm font-medium">Portfolio: ${currentValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {stocks.map((stock) => (
          <motion.div
            key={stock.symbol}
            whileHover={{ scale: 1.02 }}
            className="bg-muted p-4 rounded-md"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{stock.symbol}</h4>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${stock.price.toFixed(2)}</p>
                <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => buyStock(stock.symbol, stock.price)}
                disabled={cash < stock.price}
                className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy
              </button>
              <button
                onClick={() => sellStock(stock.symbol, stock.price)}
                disabled={!portfolio[stock.symbol] || portfolio[stock.symbol] === 0}
                className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sell
              </button>
            </div>

            {portfolio[stock.symbol] && portfolio[stock.symbol] > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Owned: {portfolio[stock.symbol]} shares
              </p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Cash</p>
            <p className="font-medium">${cash.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <p className="font-medium">${(currentValue - cash).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="font-medium">${currentValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit/Loss</p>
            <p className={`font-medium ${currentValue >= 10000 ? 'text-green-600' : 'text-red-600'}`}>
              ${(currentValue - 10000).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
