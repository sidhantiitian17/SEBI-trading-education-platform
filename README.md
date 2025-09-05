# 🏦 SEBI Trading Education Platform

A comprehensive financial trading education platform featuring advanced Three.js visualizations, virtual trading simulator, and interactive learning modules.

## ✨ Features

### 🔐 Three.js Login Interface
- **3D Animated Candlestick Charts**: Real-time market visualization
- **Floating Particles System**: Dynamic background effects
- **Neon-styled Forms**: Modern glassmorphism design
- **Responsive 3D Graphics**: Optimized for all devices

### 📈 Virtual Trading Simulator
- **Real-time Market Data**: Live stock prices and market indicators
- **Portfolio Management**: Track investments and performance
- **Risk-free Learning**: Practice trading with virtual money
- **Advanced Charts**: Interactive candlestick visualizations
- **Order Management**: Buy/sell orders with market simulation

### 🎮 Gamification System
- **Achievement System**: Unlock badges and rewards
- **XP Points**: Earn experience through learning
- **Leaderboards**: Compete with other traders
- **Daily Challenges**: Regular trading tasks
- **Progress Tracking**: Monitor learning journey

### 📚 Interactive Learning
- **Educational Modules**: Comprehensive trading courses
- **Quiz System**: Test knowledge with interactive quizzes
- **Progress Analytics**: Track learning performance
- **Video Tutorials**: Visual learning content
- **Study Groups**: Collaborative learning

### 🚀 Advanced Features
- **Algorithmic Trading**: Build and test trading strategies
- **Market Analysis**: Technical indicators and charts
- **Risk Assessment**: Portfolio risk evaluation
- **Multi-language Support**: I18n implementation
- **Dark Theme**: Modern UI/UX design
- **Mobile Responsive**: Cross-platform compatibility

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React Three.js** - 3D graphics and animations
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Modern UI components

### 3D Graphics
- **Three.js** - WebGL 3D library
- **React Three Fiber** - React renderer for Three.js
- **Custom Shaders** - GLSL for advanced effects
- **WebGL Optimization** - Performance-focused rendering

### State Management
- **React Context** - Global state management
- **Custom Hooks** - Reusable logic
- **SWR** - Data fetching and caching

### Testing & Quality
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **TypeScript** - Static type checking
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sidhantiitian17/SEBI-trading-education-platform.git
   cd SEBI-trading-education-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Routes

- `/` - Homepage with features overview
- `/three-js-login` - 3D login interface
- `/trading` - Virtual trading simulator  
- `/portfolio` - Portfolio management
- `/market` - Live market data
- `/learn` - Educational modules
- `/quizzes` - Interactive quizzes
- `/gamification` - Achievement system
- `/algo-trading` - Strategy builder

## 🎨 Key Components

### Three.js Login Interface
```typescript
// Interactive 3D login with animated candlesticks
<ThreeJSLogin />
```

### Virtual Trading Simulator
```typescript
// Full-featured trading simulator
<VirtualTradingSimulator />
```

### Gamification Dashboard
```typescript
// Achievement and progress tracking
<GamificationDashboard />
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_MARKET_DATA_API=your_market_api
```

### Tailwind Configuration
The project uses custom design tokens for consistent theming:
- Colors: Financial market theme
- Typography: Modern font stack
- Animations: Smooth transitions
- Components: Reusable UI elements

## 📊 Performance Features

- **Code Splitting**: Dynamic imports for optimal loading
- **Image Optimization**: Next.js automatic optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Component-level lazy loading
- **Caching**: Efficient data caching strategies

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Analyze bundle
npm run analyze
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SEBI** - Securities and Exchange Board of India
- **Three.js Community** - 3D graphics inspiration
- **React Three Fiber** - Excellent React integration
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Deployment platform

## 📞 Contact

**Sidhant** - [@sidhantiitian17](https://github.com/sidhantiitian17)

Project Link: [https://github.com/sidhantiitian17/SEBI-trading-education-platform](https://github.com/sidhantiitian17/SEBI-trading-education-platform)

---

⭐️ If you found this project helpful, please give it a star!
