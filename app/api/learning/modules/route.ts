import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { CourseModule, ApiResponse } from '@/lib/types';

// Mock course modules data
const courseModules: CourseModule[] = [
  {
    id: 'module-1',
    title: 'Stock Market Fundamentals',
    description: 'Learn the basics of stock market investing, including key concepts, terminology, and market structure.',
    order: 1,
    estimatedTime: 120,
    difficulty: 'beginner',
    category: 'fundamentals',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'What is Stock Market?',
        content: {
          textContent: 'Introduction to stock markets, exchanges, and basic concepts.',
          videoUrl: '/videos/stock-market-intro.mp4',
        },
        type: 'video',
        duration: 15,
        completed: false,
        resources: [
          {
            id: 'res-1-1-1',
            title: 'Stock Market Introduction',
            type: 'video',
            url: '/videos/stock-market-intro.mp4',
            language: 'en',
            tags: ['fundamentals', 'introduction'],
          },
          {
            id: 'res-1-1-2',
            title: 'Basic Concepts Guide',
            type: 'document',
            url: '/articles/stock-market-basics',
            language: 'en',
            tags: ['fundamentals', 'concepts'],
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Types of Stocks and Shares',
        content: {
          textContent: 'Understanding different types of stocks, equity shares, and market capitalization.',
          interactiveElements: [
            {
              type: 'multiple-choice',
              data: {
                question: 'Which of these represents the total value of all shares outstanding?',
                options: ['Market Price', 'Market Capitalization', 'Book Value', 'Dividend Yield'],
                correctAnswer: '1'
              },
              instructions: 'Select the correct answer about market capitalization',
            },
            {
              type: 'scenario',
              data: {
                scenario: 'stock-classification',
                assets: [
                  { name: 'Apple Inc.', marketCap: 'Large Cap', sector: 'Technology' },
                  { name: 'Local Bank', marketCap: 'Small Cap', sector: 'Banking' },
                  { name: 'Startup XYZ', marketCap: 'Micro Cap', sector: 'Technology' }
                ]
              },
              instructions: 'Classify these companies by market capitalization',
            },
          ],
        },
        type: 'interactive',
        duration: 20,
        completed: false,
        resources: [
          {
            id: 'res-1-2-1',
            title: 'Stock Types Explorer',
            type: 'link',
            url: '/interactive/stock-types',
            language: 'en',
            tags: ['fundamentals', 'stock-types'],
          },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'How Stock Prices Move',
        content: {
          textContent: 'Factors affecting stock prices, supply and demand, market psychology.',
          videoUrl: '/videos/price-movement.mp4',
        },
        type: 'video',
        duration: 18,
        completed: false,
        resources: [
          {
            id: 'res-1-3-1',
            title: 'Price Movement Factors',
            type: 'video',
            url: '/videos/price-movement.mp4',
            language: 'en',
            tags: ['fundamentals', 'price-movement'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-1',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the primary stock exchange in India?',
          options: ['NSE', 'BSE', 'NYSE', 'LSE'],
          correctAnswer: '0',
          explanation: 'NSE (National Stock Exchange) is India\'s primary stock exchange.',
          points: 10,
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What does IPO stand for?',
          options: ['Initial Public Offering', 'Indian Price Organization', 'Investment Portfolio Option', 'International Purchase Order'],
          correctAnswer: '0',
          explanation: 'IPO stands for Initial Public Offering, when a company first sells shares to the public.',
          points: 10,
        },
      ],
      passingScore: 70,
      timeLimit: 30,
      attempts: 0,
    },
    prerequisites: [],
  },
  {
    id: 'module-2',
    title: 'Technical Analysis',
    description: 'Master technical analysis tools and techniques to analyze price charts and predict market movements.',
    order: 2,
    estimatedTime: 180,
    difficulty: 'intermediate',
    category: 'technical-analysis',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Introduction to Charts',
        content: {
          textContent: 'Understanding different chart types: line, bar, candlestick charts.',
          videoUrl: '/videos/chart-types.mp4',
        },
        type: 'video',
        duration: 25,
        completed: false,
        resources: [
          {
            id: 'res-2-1-1',
            title: 'Chart Types Explained',
            type: 'video',
            url: '/videos/chart-types.mp4',
            language: 'en',
            tags: ['technical-analysis', 'charts'],
          },
          {
            id: 'res-2-1-2',
            title: 'Chart Reading Practice',
            type: 'link',
            url: '/interactive/chart-practice',
            language: 'en',
            tags: ['technical-analysis', 'practice'],
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'Trend Analysis',
        content: {
          textContent: 'Identifying trends, support and resistance levels, trend lines.',
          interactiveElements: [
            {
              type: 'chart-analysis',
              data: {
                chartType: 'candlestick',
                timeframes: ['1D', '1W', '1M'],
                indicators: ['SMA', 'EMA', 'Bollinger Bands']
              },
              instructions: 'Identify the trend direction and draw support/resistance levels on the chart',
            },
            {
              type: 'drag-drop',
              data: {
                items: ['Uptrend', 'Downtrend', 'Sideways', 'Breakout', 'Reversal'],
                targets: ['Rising peaks and troughs', 'Falling peaks and troughs', 'No clear direction', 'Breaking above resistance', 'Changing from up to down trend']
              },
              instructions: 'Match the trend patterns with their descriptions',
            },
          ],
        },
        type: 'interactive',
        duration: 30,
        completed: false,
        resources: [
          {
            id: 'res-2-2-1',
            title: 'Trend Analysis Tool',
            type: 'link',
            url: '/interactive/trend-analysis',
            language: 'en',
            tags: ['technical-analysis', 'trends'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-2',
      questions: [
        {
          id: 'q2-1',
          type: 'multiple-choice',
          question: 'What does a candlestick chart show?',
          options: ['Only closing prices', 'Open, high, low, close prices', 'Only volume', 'Only dividends'],
          correctAnswer: 'Open, high, low, close prices',
          explanation: 'Candlestick charts show the open, high, low, and close prices for each period.',
          points: 10
        },
        {
          id: 'q2-2',
          type: 'multiple-select',
          question: 'Which of the following are leading indicators?',
          options: [
            'Relative Strength Index (RSI)',
            'Moving Average Convergence Divergence (MACD)',
            'Simple Moving Average (SMA)',
            'On-Balance Volume (OBV)',
            'Bollinger Bands',
            'Stochastic Oscillator'
          ],
          correctAnswer: ['Relative Strength Index (RSI)', 'Moving Average Convergence Divergence (MACD)', 'Stochastic Oscillator'],
          explanation: 'Leading indicators like RSI, MACD, and Stochastic attempt to predict future price movements.',
          points: 15
        },
        {
          id: 'q2-3',
          type: 'scenario',
          question: 'When price breaks above a resistance level on high volume, this typically indicates:',
          options: [
            'A reversal pattern forming',
            'Strong bullish momentum',
            'Accumulation by large investors',
            'Distribution by institutional investors'
          ],
          correctAnswer: 'Strong bullish momentum',
          explanation: 'A breakout above resistance on high volume suggests strong buying pressure and bullish momentum.',
          points: 12
        },
        {
          id: 'q2-4',
          type: 'true-false',
          question: 'Support and resistance levels are always fixed and never change.',
          correctAnswer: false,
          explanation: 'Support and resistance levels are dynamic and can change based on market conditions, volume, and time.',
          points: 8
        },
        {
          id: 'q2-5',
          type: 'multiple-choice',
          question: 'What does the Relative Strength Index (RSI) measure?',
          options: [
            'Price momentum and overbought/oversold conditions',
            'Trading volume trends',
            'Market volatility',
            'Price trends direction'
          ],
          correctAnswer: 'Price momentum and overbought/oversold conditions',
          explanation: 'RSI measures the speed and magnitude of price changes to identify overbought (>70) and oversold (<30) conditions.',
          points: 12
        },
        {
          id: 'q2-6',
          type: 'fill-blank',
          question: 'A chart pattern that signals a potential trend reversal after a prolonged uptrend is called a _____.',
          correctAnswer: 'double top',
          explanation: 'A double top is a bearish reversal pattern that forms after an uptrend, indicating potential selling pressure.',
          points: 10
        },
        {
          id: 'q2-7',
          type: 'multiple-choice',
          question: 'Which timeframe is typically used for long-term trend analysis?',
          options: [
            '1-minute chart',
            '15-minute chart',
            'Daily chart',
            'Weekly or monthly charts'
          ],
          correctAnswer: 'Weekly or monthly charts',
          explanation: 'Weekly and monthly charts are better suited for identifying long-term trends and major market movements.',
          points: 10
        }
      ],
      passingScore: 75,
      timeLimit: 50,
      attempts: 0,
    },
    prerequisites: ['module-1'],
  },
  {
    id: 'module-3',
    title: 'Fundamental Analysis',
    description: 'Learn to evaluate companies using financial statements, ratios, and economic indicators.',
    order: 3,
    estimatedTime: 150,
    difficulty: 'intermediate',
    category: 'fundamental-analysis',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Financial Statements',
        content: {
          textContent: 'Understanding balance sheet, income statement, and cash flow statement.',
          videoUrl: '/videos/financial-statements.mp4',
        },
        type: 'video',
        duration: 20,
        completed: false,
        resources: [
          {
            id: 'res-3-1-1',
            title: 'Financial Statements Overview',
            type: 'video',
            url: '/videos/financial-statements.mp4',
            language: 'en',
            tags: ['fundamental-analysis', 'financial-statements'],
          },
          {
            id: 'res-3-1-2',
            title: 'How to Read a Balance Sheet',
            type: 'document',
            url: '/articles/reading-balance-sheet',
            language: 'en',
            tags: ['fundamental-analysis', 'balance-sheet'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-3',
      questions: [
        {
          id: 'q3-1',
          type: 'multiple-choice',
          question: 'Which financial statement shows a company\'s revenues, expenses, and profits over a period of time?',
          options: [
            'Balance Sheet',
            'Income Statement',
            'Cash Flow Statement',
            'Statement of Shareholders\' Equity'
          ],
          correctAnswer: 'Income Statement',
          explanation: 'The income statement (also called profit & loss statement) shows revenues, expenses, and net income over a specific period.',
          points: 10
        },
        {
          id: 'q3-2',
          type: 'multiple-select',
          question: 'Which of the following are key valuation ratios?',
          options: [
            'Price-to-Earnings (P/E) Ratio',
            'Current Ratio',
            'Return on Equity (ROE)',
            'Debt-to-Equity Ratio',
            'Price-to-Book (P/B) Ratio',
            'Inventory Turnover'
          ],
          correctAnswer: ['Price-to-Earnings (P/E) Ratio', 'Return on Equity (ROE)', 'Price-to-Book (P/B) Ratio'],
          explanation: 'P/E, ROE, and P/B ratios are primarily used for valuation, while Current Ratio, Debt-to-Equity, and Inventory Turnover are liquidity and efficiency ratios.',
          points: 15
        },
        {
          id: 'q3-3',
          type: 'scenario',
          question: 'A company has a P/E ratio of 8 while the industry average is 15. This suggests:',
          options: [
            'The stock is overvalued',
            'The stock is undervalued',
            'The company has high growth prospects',
            'The industry is in decline'
          ],
          correctAnswer: 'The stock is undervalued',
          explanation: 'A lower P/E ratio compared to the industry average suggests the stock may be undervalued relative to its earnings.',
          points: 12
        },
        {
          id: 'q3-4',
          type: 'true-false',
          question: 'Free Cash Flow (FCF) represents the cash available for dividends, debt reduction, and reinvestment after accounting for operating expenses and capital expenditures.',
          correctAnswer: true,
          explanation: 'FCF is the cash generated after accounting for cash outflows to support operations and maintain capital assets.',
          points: 8
        },
        {
          id: 'q3-5',
          type: 'multiple-choice',
          question: 'What does a current ratio of 2.5 indicate?',
          options: [
            'The company has too much debt',
            'The company is highly liquid',
            'The company has poor profitability',
            'The company is overvalued'
          ],
          correctAnswer: 'The company is highly liquid',
          explanation: 'A current ratio of 2.5 means the company has $2.50 in current assets for every $1 in current liabilities, indicating good liquidity.',
          points: 10
        },
        {
          id: 'q3-6',
          type: 'fill-blank',
          question: 'The ratio that measures how efficiently a company uses its assets to generate profits is called _____.',
          correctAnswer: 'return on assets (ROA)',
          explanation: 'ROA shows how effectively a company converts its assets into net income.',
          points: 10
        },
        {
          id: 'q3-7',
          type: 'multiple-choice',
          question: 'Which economic indicator is most important for cyclical industries like automobiles?',
          options: [
            'Interest rates',
            'GDP growth',
            'Inflation rate',
            'Currency exchange rates'
          ],
          correctAnswer: 'GDP growth',
          explanation: 'GDP growth is a key indicator for cyclical industries as it reflects overall economic activity and consumer spending power.',
          points: 12
        }
      ],
      passingScore: 75,
      timeLimit: 50,
      attempts: 0,
    },
    prerequisites: ['module-1'],
  },
  {
    id: 'module-4',
    title: 'Risk Management',
    description: 'Master risk assessment, portfolio diversification, and risk mitigation strategies.',
    order: 4,
    estimatedTime: 120,
    difficulty: 'intermediate',
    category: 'risk-management',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'Understanding Risk',
        content: {
          textContent: 'Types of investment risk and risk assessment methods.',
          videoUrl: '/videos/investment-risk.mp4',
        },
        type: 'video',
        duration: 15,
        completed: false,
        resources: [
          {
            id: 'res-4-1-1',
            title: 'Investment Risk Types',
            type: 'video',
            url: '/videos/investment-risk.mp4',
            language: 'en',
            tags: ['risk-management', 'investment-risk'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-4',
      questions: [
        {
          id: 'q4-1',
          type: 'multiple-choice',
          question: 'Which of the following is considered a systematic risk?',
          options: [
            'Company-specific management change',
            'Interest rate changes affecting the entire market',
            'Poor product quality of a specific company',
            'Labor strike at a single corporation'
          ],
          correctAnswer: 'Interest rate changes affecting the entire market',
          explanation: 'Systematic risk affects the entire market or economy, while unsystematic risk is specific to individual companies.',
          points: 10
        },
        {
          id: 'q4-2',
          type: 'multiple-select',
          question: 'Which metrics are commonly used to measure portfolio risk?',
          options: [
            'Sharpe Ratio',
            'Standard Deviation',
            'Beta',
            'Dividend Yield',
            'Value at Risk (VaR)',
            'Price-to-Earnings Ratio'
          ],
          correctAnswer: ['Sharpe Ratio', 'Standard Deviation', 'Beta', 'Value at Risk (VaR)'],
          explanation: 'Sharpe Ratio, Standard Deviation, Beta, and VaR are key risk metrics. Dividend Yield and P/E Ratio are valuation metrics.',
          points: 15
        },
        {
          id: 'q4-3',
          type: 'scenario',
          question: 'A conservative investor with low risk tolerance should primarily focus on:',
          options: [
            'Growth stocks with high volatility',
            'Bonds and dividend-paying stocks',
            'Cryptocurrency investments',
            'Leveraged ETFs'
          ],
          correctAnswer: 'Bonds and dividend-paying stocks',
          explanation: 'Conservative investors should prioritize capital preservation and steady income over high-risk, high-reward investments.',
          points: 12
        },
        {
          id: 'q4-4',
          type: 'true-false',
          question: 'Diversification can completely eliminate all investment risk.',
          correctAnswer: false,
          explanation: 'Diversification reduces unsystematic risk but cannot eliminate systematic risk that affects the entire market.',
          points: 8
        },
        {
          id: 'q4-5',
          type: 'multiple-choice',
          question: 'What does a beta coefficient of 1.2 indicate about a stock?',
          options: [
            'The stock is less volatile than the market',
            'The stock moves in the opposite direction of the market',
            'The stock is 20% more volatile than the market',
            'The stock has no correlation with the market'
          ],
          correctAnswer: 'The stock is 20% more volatile than the market',
          explanation: 'A beta of 1.2 means the stock is 20% more volatile than the overall market.',
          points: 12
        },
        {
          id: 'q4-6',
          type: 'fill-blank',
          question: 'The maximum loss an investor can expect over a specific time period with a given confidence level is measured by _____.',
          correctAnswer: 'Value at Risk (VaR)',
          explanation: 'VaR quantifies the potential loss in value of a portfolio over a defined period for a given confidence interval.',
          points: 10
        }
      ],
      passingScore: 75,
      timeLimit: 45,
      attempts: 0,
    },
    prerequisites: ['module-1', 'module-2'],
  },
  {
    id: 'module-5',
    title: 'Portfolio Management',
    description: 'Learn to build and manage investment portfolios with proper asset allocation.',
    order: 5,
    estimatedTime: 140,
    difficulty: 'advanced',
    category: 'portfolio-management',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Asset Allocation',
        content: {
          textContent: 'Principles of asset allocation and portfolio construction.',
          interactiveElements: [
            {
              type: 'scenario',
              data: {
                scenario: 'portfolio-allocation',
                profiles: [
                  { name: 'Conservative', stocks: 30, bonds: 50, cash: 20, expectedReturn: 6, risk: 'Low' },
                  { name: 'Moderate', stocks: 60, bonds: 30, cash: 10, expectedReturn: 8, risk: 'Medium' },
                  { name: 'Aggressive', stocks: 80, bonds: 15, cash: 5, expectedReturn: 10, risk: 'High' }
                ]
              },
              instructions: 'Choose the appropriate asset allocation based on your risk tolerance and investment goals',
            },
            {
              type: 'drag-drop',
              data: {
                items: ['Stocks', 'Bonds', 'Real Estate', 'Commodities', 'Cash'],
                targets: ['High growth potential', 'Income generation', 'Inflation hedge', 'Diversification', 'Liquidity and safety']
              },
              instructions: 'Match asset classes with their primary benefits',
            },
          ],
        },
        type: 'interactive',
        duration: 25,
        completed: false,
        resources: [
          {
            id: 'res-5-1-1',
            title: 'Asset Allocation Calculator',
            type: 'link',
            url: '/interactive/asset-allocation',
            language: 'en',
            tags: ['portfolio-management', 'asset-allocation'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-5',
      questions: [
        {
          id: 'q5-1',
          type: 'multiple-choice',
          question: 'Which portfolio allocation strategy aims to minimize risk for a given level of expected return?',
          options: [
            'Equal Weight',
            'Market Cap Weight',
            'Modern Portfolio Theory (MPT)',
            'Buy and Hold'
          ],
          correctAnswer: 'Modern Portfolio Theory (MPT)',
          explanation: 'MPT focuses on optimizing the risk-return tradeoff by selecting the portfolio with the highest expected return for a given risk level.',
          points: 12
        },
        {
          id: 'q5-2',
          type: 'scenario',
          question: 'For a young investor with a long time horizon and high risk tolerance, which asset allocation would be most appropriate?',
          options: [
            '80% Bonds, 20% Stocks',
            '60% Bonds, 40% Stocks',
            '40% Bonds, 60% Stocks',
            '20% Bonds, 80% Stocks'
          ],
          correctAnswer: '20% Bonds, 80% Stocks',
          explanation: 'Young investors can afford more risk due to their long time horizon, allowing them to benefit from higher potential returns of stocks.',
          points: 15
        },
        {
          id: 'q5-3',
          type: 'multiple-select',
          question: 'Which of the following are benefits of portfolio diversification?',
          options: [
            'Guaranteed higher returns',
            'Reduced unsystematic risk',
            'Elimination of all market risk',
            'Smoothing of returns over time',
            'Lower transaction costs',
            'Protection against company-specific events'
          ],
          correctAnswer: ['Reduced unsystematic risk', 'Smoothing of returns over time', 'Protection against company-specific events'],
          explanation: 'Diversification reduces unsystematic risk and protects against company-specific events, but cannot eliminate systematic risk or guarantee higher returns.',
          points: 18
        },
        {
          id: 'q5-4',
          type: 'true-false',
          question: 'Rebalancing a portfolio involves buying and selling assets to maintain the original asset allocation.',
          correctAnswer: true,
          explanation: 'Rebalancing ensures the portfolio maintains its target asset allocation as market movements cause deviations from the original weights.',
          points: 8
        },
        {
          id: 'q5-5',
          type: 'multiple-choice',
          question: 'What is the primary purpose of the efficient frontier in portfolio theory?',
          options: [
            'To identify the best performing stocks',
            'To show optimal risk-return combinations',
            'To predict future market movements',
            'To calculate dividend yields'
          ],
          correctAnswer: 'To show optimal risk-return combinations',
          explanation: 'The efficient frontier represents the set of optimal portfolios that offer the highest expected return for a given risk level.',
          points: 12
        },
        {
          id: 'q5-6',
          type: 'fill-blank',
          question: 'The process of adjusting portfolio weights to reduce risk without sacrificing expected returns is called _____.',
          correctAnswer: 'optimization',
          explanation: 'Portfolio optimization involves finding the best asset allocation to maximize returns for a given risk level or minimize risk for a given return.',
          points: 10
        },
        {
          id: 'q5-7',
          type: 'multiple-choice',
          question: 'Which investment strategy involves investing in assets that are negatively correlated?',
          options: [
            'Sector rotation',
            'Hedging',
            'Dollar-cost averaging',
            'Market timing'
          ],
          correctAnswer: 'Hedging',
          explanation: 'Hedging involves taking positions that offset potential losses in other investments, often using negatively correlated assets.',
          points: 10
        }
      ],
      passingScore: 75,
      timeLimit: 50,
      attempts: 0,
    },
    prerequisites: ['module-1', 'module-3', 'module-4'],
  },
  {
    id: 'module-6',
    title: 'Algorithmic Trading',
    description: 'Introduction to algorithmic trading strategies and automated trading systems.',
    order: 6,
    estimatedTime: 200,
    difficulty: 'advanced',
    category: 'algorithmic-trading',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'Introduction to Algo Trading',
        content: {
          textContent: 'Understanding algorithmic trading and its advantages.',
          videoUrl: '/videos/algo-trading-intro.mp4',
        },
        type: 'video',
        duration: 20,
        completed: false,
        resources: [
          {
            id: 'res-6-1-1',
            title: 'Algorithmic Trading Basics',
            type: 'video',
            url: '/videos/algo-trading-intro.mp4',
            language: 'en',
            tags: ['algorithmic-trading', 'introduction'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-6',
      questions: [
        {
          id: 'q6-1',
          type: 'multiple-choice',
          question: 'What is the primary advantage of algorithmic trading over manual trading?',
          options: [
            'Emotional decision making',
            'Speed and precision in order execution',
            'Higher transaction costs',
            'Limited market access'
          ],
          correctAnswer: 'Speed and precision in order execution',
          explanation: 'Algorithmic trading eliminates emotional decision-making and provides speed, precision, and the ability to execute complex strategies consistently.',
          points: 10
        },
        {
          id: 'q6-2',
          type: 'true-false',
          question: 'Algorithmic trading can only be used for high-frequency trading strategies.',
          correctAnswer: false,
          explanation: 'Algorithmic trading can be used for various strategies including long-term investing, arbitrage, and portfolio rebalancing, not just high-frequency trading.',
          points: 8
        },
        {
          id: 'q6-3',
          type: 'multiple-select',
          question: 'Which of the following are common components of an algorithmic trading system?',
          options: [
            'Data feed',
            'Strategy engine',
            'Risk management module',
            'Order routing system',
            'Social media integration',
            'Performance analytics'
          ],
          correctAnswer: ['Data feed', 'Strategy engine', 'Risk management module', 'Order routing system', 'Performance analytics'],
          explanation: 'A complete algorithmic trading system includes data feeds, strategy execution, risk management, order routing, and performance tracking.',
          points: 15
        },
        {
          id: 'q6-4',
          type: 'scenario',
          question: 'During a market flash crash, an algorithmic trading system should:',
          options: [
            'Continue executing orders at any price',
            'Immediately halt all trading activities',
            'Increase order sizes to take advantage of volatility',
            'Ignore circuit breakers and continue trading'
          ],
          correctAnswer: 'Immediately halt all trading activities',
          explanation: 'During extreme market conditions, algorithmic systems should have circuit breakers to prevent catastrophic losses.',
          points: 12
        },
        {
          id: 'q6-5',
          type: 'multiple-choice',
          question: 'What is "slippage" in algorithmic trading?',
          options: [
            'The difference between expected and actual execution price',
            'The time delay in order execution',
            'The commission charged by brokers',
            'The spread between bid and ask prices'
          ],
          correctAnswer: 'The difference between expected and actual execution price',
          explanation: 'Slippage occurs when the actual execution price differs from the expected price due to market movement or liquidity issues.',
          points: 10
        },
        {
          id: 'q6-6',
          type: 'fill-blank',
          question: 'The process of testing a trading strategy on historical data before live implementation is called _____.',
          correctAnswer: 'backtesting',
          explanation: 'Backtesting evaluates how a strategy would have performed in the past using historical market data.',
          points: 10
        },
        {
          id: 'q6-7',
          type: 'multiple-choice',
          question: 'Which programming language is most commonly used for developing algorithmic trading strategies?',
          options: [
            'JavaScript',
            'Python',
            'HTML',
            'CSS'
          ],
          correctAnswer: 'Python',
          explanation: 'Python is widely used in algorithmic trading due to its extensive libraries for data analysis, machine learning, and financial computations.',
          points: 8
        }
      ],
      passingScore: 80,
      timeLimit: 55,
      attempts: 0,
    },
    prerequisites: ['module-1', 'module-2', 'module-5'],
  },
  {
    id: 'module-7',
    title: 'High-Frequency Trading (HFT)',
    description: 'Master high-frequency trading strategies, market microstructure, and advanced execution techniques.',
    order: 7,
    estimatedTime: 250,
    difficulty: 'expert',
    category: 'hft-trading',
    lessons: [
      {
        id: 'lesson-7-1',
        title: 'HFT Fundamentals',
        content: {
          textContent: 'Understanding high-frequency trading, market microstructure, and the role of speed in modern markets.',
          videoUrl: '/videos/hft-fundamentals.mp4',
          interactiveElements: [
            {
              type: 'simulation',
              data: { scenario: 'order-book-dynamics' },
              instructions: 'Observe how HFT algorithms interact with the order book',
            },
          ],
        },
        type: 'interactive',
        duration: 35,
        completed: false,
        resources: [
          {
            id: 'res-7-1-1',
            title: 'HFT Market Structure',
            type: 'video',
            url: '/videos/hft-fundamentals.mp4',
            language: 'en',
            tags: ['hft', 'market-microstructure'],
          },
          {
            id: 'res-7-1-2',
            title: 'Order Book Simulator',
            type: 'link',
            url: '/interactive/order-book-simulator',
            language: 'en',
            tags: ['hft', 'order-book', 'simulation'],
          },
        ],
      },
      {
        id: 'lesson-7-2',
        title: 'Latency and Execution',
        content: {
          textContent: 'The importance of low latency, co-location, and execution optimization in HFT.',
          interactiveElements: [
            {
              type: 'latency-simulator',
              data: { scenarios: ['co-location', 'direct-market-access', 'algorithmic-routing'] },
              instructions: 'Compare execution times across different latency optimization techniques',
            },
          ],
        },
        type: 'interactive',
        duration: 40,
        completed: false,
        resources: [
          {
            id: 'res-7-2-1',
            title: 'Latency Optimization Guide',
            type: 'document',
            url: '/articles/hft-latency-optimization',
            language: 'en',
            tags: ['hft', 'latency', 'execution'],
          },
          {
            id: 'res-7-2-2',
            title: 'Execution Simulator',
            type: 'link',
            url: '/interactive/execution-simulator',
            language: 'en',
            tags: ['hft', 'execution', 'latency'],
          },
        ],
      },
      {
        id: 'lesson-7-3',
        title: 'HFT Strategies',
        content: {
          textContent: 'Common HFT strategies including market making, arbitrage, and momentum trading.',
          interactiveElements: [
            {
              type: 'strategy-simulator',
              data: {
                strategies: [
                  'market-making',
                  'statistical-arbitrage',
                  'momentum-ignition',
                  'order-flow-analysis'
                ]
              },
              instructions: 'Test different HFT strategies in simulated market conditions',
            },
          ],
        },
        type: 'interactive',
        duration: 45,
        completed: false,
        resources: [
          {
            id: 'res-7-3-1',
            title: 'HFT Strategy Analysis',
            type: 'video',
            url: '/videos/hft-strategies.mp4',
            language: 'en',
            tags: ['hft', 'strategies', 'market-making'],
          },
          {
            id: 'res-7-3-2',
            title: 'Strategy Backtester',
            type: 'link',
            url: '/interactive/hft-strategy-tester',
            language: 'en',
            tags: ['hft', 'backtesting', 'strategies'],
          },
        ],
      },
      {
        id: 'lesson-7-4',
        title: 'Risk Management in HFT',
        content: {
          textContent: 'Managing risks in high-frequency trading including position limits, circuit breakers, and monitoring.',
          interactiveElements: [
            {
              type: 'risk-simulator',
              data: {
                scenarios: [
                  'flash-crash',
                  'high-volatility',
                  'liquidity-crisis',
                  'system-failure'
                ]
              },
              instructions: 'Test risk management protocols in extreme market conditions',
            },
          ],
        },
        type: 'interactive',
        duration: 35,
        completed: false,
        resources: [
          {
            id: 'res-7-4-1',
            title: 'HFT Risk Management',
            type: 'document',
            url: '/articles/hft-risk-management',
            language: 'en',
            tags: ['hft', 'risk-management', 'monitoring'],
          },
          {
            id: 'res-7-4-2',
            title: 'Risk Simulator',
            type: 'link',
            url: '/interactive/hft-risk-simulator',
            language: 'en',
            tags: ['hft', 'risk', 'simulation'],
          },
        ],
      },
      {
        id: 'lesson-7-5',
        title: 'Building HFT Systems',
        content: {
          textContent: 'Technical aspects of building HFT systems including hardware, software, and infrastructure.',
          interactiveElements: [
            {
              type: 'system-builder',
              data: {
                components: [
                  'low-latency-networking',
                  'high-performance-computing',
                  'real-time-data-feeds',
                  'order-management-system'
                ]
              },
              instructions: 'Design and optimize an HFT system architecture',
            },
          ],
        },
        type: 'interactive',
        duration: 50,
        completed: false,
        resources: [
          {
            id: 'res-7-5-1',
            title: 'HFT System Architecture',
            type: 'video',
            url: '/videos/hft-system-architecture.mp4',
            language: 'en',
            tags: ['hft', 'system-design', 'infrastructure'],
          },
          {
            id: 'res-7-5-2',
            title: 'System Builder Tool',
            type: 'link',
            url: '/interactive/hft-system-builder',
            language: 'en',
            tags: ['hft', 'architecture', 'design'],
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-7',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the primary advantage of high-frequency trading?',
          options: [
            'Lower transaction costs',
            'Ability to process orders in microseconds',
            'Access to insider information',
            'Guaranteed profits'
          ],
          correctAnswer: '1',
          explanation: 'HFT can process orders in microseconds, allowing traders to capitalize on small price movements and market inefficiencies.',
          points: 15,
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What is co-location in HFT?',
          options: [
            'Trading from home',
            'Placing servers in the same data center as the exchange',
            'Using cloud computing',
            'Trading during market hours only'
          ],
          correctAnswer: '1',
          explanation: 'Co-location involves placing trading servers physically close to exchange servers to minimize network latency.',
          points: 15,
        },
        {
          id: 'q3',
          type: 'true-false',
          question: 'HFT strategies always guarantee profits.',
          correctAnswer: 'false',
          explanation: 'HFT strategies carry significant risks and can result in substantial losses, especially during extreme market conditions.',
          points: 10,
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'Which of the following are common HFT strategies?',
          options: [
            'Market making',
            'Statistical arbitrage',
            'Day trading',
            'Order flow analysis',
            'Swing trading'
          ],
          correctAnswer: '0,1,3',
          explanation: 'Market making, statistical arbitrage, and order flow analysis are common HFT strategies that rely on speed and algorithms.',
          points: 20,
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'What is the main risk of HFT during high volatility?',
          options: [
            'Slow execution',
            'Large position accumulation',
            'Missing small profits',
            'Network downtime'
          ],
          correctAnswer: '1',
          explanation: 'During high volatility, HFT algorithms may accumulate large positions that can lead to significant losses if the market reverses.',
          points: 15,
        },
      ],
      passingScore: 85,
      timeLimit: 60,
      attempts: 0,
    },
    prerequisites: ['module-6'],
  },
  {
    id: 'module-8',
    title: 'Advanced Algorithmic Trading',
    description: 'Master sophisticated trading algorithms, quantitative strategies, and machine learning in trading.',
    order: 8,
    estimatedTime: 300,
    difficulty: 'expert',
    category: 'algorithmic-trading',
    lessons: [
      {
        id: 'lesson-8-1',
        title: 'Quantitative Trading Strategies',
        content: {
          textContent: 'Learn about statistical arbitrage, pairs trading, and machine learning-based strategies.',
          interactiveElements: [
            {
              type: 'simulation',
              data: {
                strategies: ['Statistical Arbitrage', 'Pairs Trading', 'ML-based Prediction'],
                parameters: {
                  lookbackPeriod: 252,
                  confidenceLevel: 0.95,
                  maxPositionSize: 0.1
                }
              },
              instructions: 'Test different quantitative strategies on historical data using the algo trading simulator'
            },
            {
              type: 'scenario',
              data: {
                scenarios: [
                  {
                    condition: 'Bull Market',
                    strategy: 'Momentum-based',
                    expectedReturn: 'High',
                    risk: 'Medium'
                  },
                  {
                    condition: 'Bear Market',
                    strategy: 'Mean-reversion',
                    expectedReturn: 'Low',
                    risk: 'High'
                  },
                  {
                    condition: 'Sideways Market',
                    strategy: 'Range trading',
                    expectedReturn: 'Medium',
                    risk: 'Low'
                  }
                ]
              },
              instructions: 'Identify different market conditions and adapt strategies accordingly'
            }
          ]
        },
        type: 'interactive',
        duration: 45,
        completed: false,
        resources: [
          {
            id: 'res-8-1-1',
            title: 'Advanced Algo Trading Simulator',
            type: 'link',
            url: '/algo-trading-simulator',
            language: 'en',
            tags: ['algorithmic-trading', 'backtesting', 'quantitative']
          }
        ]
      },
      {
        id: 'lesson-8-2',
        title: 'Advanced Risk Management',
        content: {
          textContent: 'Implement sophisticated risk controls and portfolio optimization techniques.',
          interactiveElements: [
            {
              type: 'strategy-simulator',
              data: {
                constraints: {
                  minWeight: 0.01,
                  maxWeight: 0.3,
                  targetReturn: 0.08
                }
              },
              instructions: 'Optimize portfolio weights using modern portfolio theory'
            },
            {
              type: 'risk-simulator',
              data: {
                scenarios: [
                  '2008 Financial Crisis',
                  'COVID-19 Market Crash',
                  'Tech Bubble Burst',
                  'Interest Rate Shock'
                ]
              },
              instructions: 'Test portfolio performance under extreme market conditions'
            }
          ]
        },
        type: 'interactive',
        duration: 40,
        completed: false,
        resources: [
          {
            id: 'res-8-2-1',
            title: 'Risk Management Tools',
            type: 'link',
            url: '/portfolio-diversification',
            language: 'en',
            tags: ['risk-management', 'portfolio-optimization']
          }
        ]
      },
      {
        id: 'lesson-8-3',
        title: 'Order Execution Algorithms',
        content: {
          textContent: 'Master VWAP, TWAP, and other sophisticated order execution strategies.',
          interactiveElements: [
            {
              type: 'latency-simulator',
              data: {
                orderSize: 100000,
                timeHorizon: 60,
                urgency: 'medium'
              },
              instructions: 'Minimize market impact while achieving execution goals'
            },
            {
              type: 'system-builder',
              data: {
                components: [
                  'Data Feed',
                  'Strategy Engine',
                  'Risk Manager',
                  'Order Router',
                  'Performance Monitor'
                ]
              },
              instructions: 'Create a complete algorithmic trading system from scratch'
            }
          ]
        },
        type: 'interactive',
        duration: 50,
        completed: false,
        resources: []
      },
      {
        id: 'lesson-8-4',
        title: 'Machine Learning in Trading',
        content: {
          textContent: 'Apply ML techniques to predict market movements and optimize strategies.',
          interactiveElements: [
            {
              type: 'ml-simulator',
              data: {
                models: [
                  'Linear Regression',
                  'Random Forest',
                  'Neural Network',
                  'LSTM Network'
                ],
                features: [
                  'Price History',
                  'Volume',
                  'Technical Indicators',
                  'Market Sentiment',
                  'Economic Data'
                ]
              },
              instructions: 'Train ML models on historical data to predict price movements'
            },
            {
              type: 'backtest-engine',
              data: {
                validationMethods: [
                  'Train/Validation/Test Split',
                  'Time Series Cross-Validation',
                  'Walk-Forward Analysis'
                ]
              },
              instructions: 'Backtest ML-based strategies with walk-forward analysis'
            }
          ]
        },
        type: 'interactive',
        duration: 55,
        completed: false,
        resources: []
      },
      {
        id: 'lesson-8-5',
        title: 'Live Trading Integration',
        content: {
          textContent: 'Connect algorithms to live markets with proper risk controls.',
          interactiveElements: [
            {
              type: 'live-simulator',
              data: {
                features: [
                  'Real-time Data',
                  'Order Execution',
                  'Portfolio Tracking',
                  'Performance Analytics'
                ]
              },
              instructions: 'Test algorithms in real-time with paper trading accounts'
            },
            {
              type: 'deployment-checklist',
              data: {
                requirements: [
                  'Code Review',
                  'Risk Limits',
                  'Monitoring Systems',
                  'Emergency Stop',
                  'Backup Systems'
                ]
              },
              instructions: 'Checklist for deploying algorithms to live trading'
            }
          ]
        },
        type: 'interactive',
        duration: 45,
        completed: false,
        resources: []
      }
    ],
    quiz: {
      id: 'quiz-8',
      questions: [
        {
          id: 'q8-1',
          type: 'multiple-choice',
          question: 'Which of the following is NOT a common quantitative trading strategy?',
          options: [
            'Statistical Arbitrage',
            'Pairs Trading',
            'Day Trading',
            'Machine Learning Prediction'
          ],
          correctAnswer: 'Day Trading',
          explanation: 'Day trading is a manual trading style, while the others are quantitative strategies that can be automated.',
          points: 10
        },
        {
          id: 'q8-2',
          type: 'multiple-select',
          question: 'Which risk metrics are commonly used in algorithmic trading?',
          options: [
            'Sharpe Ratio',
            'Maximum Drawdown',
            'Win Rate',
            'Trading Volume',
            'Value at Risk (VaR)',
            'Beta'
          ],
          correctAnswer: ['Sharpe Ratio', 'Maximum Drawdown', 'Win Rate', 'Value at Risk (VaR)', 'Beta'],
          explanation: 'Sharpe Ratio, Maximum Drawdown, Win Rate, VaR, and Beta are key risk metrics. Trading Volume is more of a market metric.',
          points: 15
        },
        {
          id: 'q8-3',
          type: 'scenario',
          question: 'In a high-volatility market environment, which strategy would be most appropriate?',
          options: [
            'Mean Reversion',
            'Momentum',
            'Statistical Arbitrage',
            'Market Making'
          ],
          correctAnswer: 'Momentum',
          explanation: 'In high-volatility environments, momentum strategies tend to perform better as trends are stronger and more sustained.',
          points: 10
        }
      ],
      passingScore: 80,
      timeLimit: 60,
      attempts: 0,
    },
    prerequisites: ['module-6', 'module-7'],
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // Note: We'll allow unauthenticated access for demo purposes
    // if (!userId) {
    //   return NextResponse.json<ApiResponse<null>>({
    //     success: false,
    //     error: 'Unauthorized',
    //   }, { status: 401 });
    // }

    const response: ApiResponse<CourseModule[]> = {
      success: true,
      data: courseModules,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get modules error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { moduleId, lessonId } = await request.json();

    // Find the module and lesson
    const module = courseModules.find(m => m.id === moduleId);
    if (!module) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Module not found',
      }, { status: 404 });
    }

    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Lesson not found',
      }, { status: 404 });
    }

    // Mark lesson as completed
    lesson.completed = true;

    const response: ApiResponse<{ message: string; module: CourseModule }> = {
      success: true,
      data: {
        message: 'Lesson completed successfully',
        module,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Complete lesson error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
