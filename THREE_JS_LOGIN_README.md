# Three.js Login Interface

This is a high-fidelity recreation of the StockLearn login interface using Three.js, React Three Fiber, and Next.js. The interface matches the original design exactly with:

## Features

### Visual Elements
- **Cyberpunk/Futuristic Theme**: Dark background with neon cyan and purple color scheme
- **3D Animated Background**: 
  - Floating animated candlesticks representing stock market data
  - Animated stock chart lines with real-time motion
  - Floating particle effects
  - Grid overlay for depth
  - Glowing orbs for ambient lighting

### Stock Market Elements
- **Live Stock Tickers**: Animated percentage indicators on left and right sides
- **BULL Market Indicators**: Prominent BULL badges and text
- **Candlestick Charts**: 3D animated candlesticks in red and green
- **Chart Lines**: Animated zigzag lines simulating stock price movements

### Login Form
- **Neon Glow Effects**: All input fields have cyan neon borders and glow
- **StockLearn Branding**: Large cyan "Stock" + white "Learn" title
- **Tab Navigation**: Login/Register tabs with active state styling
- **Input Fields**: 
  - Email input with neon styling
  - Password input with show/hide toggle
  - Remember me checkbox with custom styling
- **Neon Button**: Gradient cyan login button with hover effects
- **Form Validation**: Error message display with neon styling

### Interactive Features
- **Tab Switching**: Seamless transition between Login and Register forms
- **Password Toggle**: Eye icon to show/hide password
- **Hover Effects**: All interactive elements have smooth hover animations
- **Responsive Design**: Adapts to different screen sizes

## Technical Implementation

### Technologies Used
- **Next.js 14**: React framework
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for React Three Fiber
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety
- **Lucide React**: Icon library

### File Structure
```
components/
  three-js-login-clean.tsx     # Main login component
styles/
  three-js-login.css           # Custom neon styling
app/
  three-js-login/
    page.tsx                   # Page component
```

## How to View

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the Interface**:
   Open your browser and go to:
   ```
   http://localhost:3000/three-js-login
   ```

3. **Interact with the Interface**:
   - Switch between Login and Register tabs
   - Type in the input fields to see the neon effects
   - Toggle password visibility with the eye icon
   - Hover over buttons to see animations
   - Observe the animated 3D background elements

## Design Fidelity

This implementation achieves 1:1 visual fidelity with the original design:

### Exact Matches
- ✅ Color scheme (cyan #22d3ee, dark backgrounds)
- ✅ Typography (large StockLearn title, font weights)
- ✅ Layout and spacing
- ✅ Stock market data placement and styling
- ✅ Form field styling and dimensions
- ✅ Button gradient and shadows
- ✅ Neon glow effects
- ✅ Background elements and composition

### Enhanced Features
- ✅ 3D animated candlesticks
- ✅ Real-time chart animations
- ✅ Particle effects
- ✅ Smooth transitions and hover states
- ✅ Interactive form validation

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: WebGL support is required for the 3D animations.

## Performance

The interface is optimized for performance with:
- Efficient Three.js rendering
- Memoized components
- Smooth 60fps animations
- Minimal bundle size impact
