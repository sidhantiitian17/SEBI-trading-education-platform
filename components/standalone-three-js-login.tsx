'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/three-js-login.css';

// Animated Candlestick Component
function AnimatedCandlestick({ position, height, color }: { position: [number, number, number], height: number, color: string }) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const wickRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const offset = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    if (bodyRef.current) {
      bodyRef.current.position.y = position[1] + offset;
    }
    if (wickRef.current) {
      wickRef.current.position.y = position[1] + height * 0.3 + offset;
    }
  });

  return (
    <group>
      <mesh ref={bodyRef} position={position}>
        <boxGeometry args={[0.3, height, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh ref={wickRef} position={[position[0], position[1] + height * 0.3, position[2]]}>
        <boxGeometry args={[0.05, height * 0.6, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Floating Particles Component
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        pos[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.6} />
    </points>
  );
}

// Stock Chart Line Component using mesh trails
function StockChartLine({ color = '#ff0080', yOffset = 0 }: { color?: string; yOffset?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime * 0.5;
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = Math.sin(i * 0.3 + time) * 3 + Math.cos(i * 0.7 + time * 1.5) * 1.5 + Math.sin(time * 2 + i) * 0.2 + yOffset;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={i} position={[-15 + i * 1, yOffset, -3]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Background Scene Component
function BackgroundScene() {
  return (
    <>
      {/* Gradient Background Planes */}
      <mesh position={[0, 0, -15]} scale={[60, 60, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#050510" />
      </mesh>
      
      <mesh position={[0, 0, -14]} scale={[60, 60, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1a0a2e" transparent opacity={0.8} />
      </mesh>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Animated Candlesticks */}
      {Array.from({ length: 25 }).map((_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        return (
          <AnimatedCandlestick
            key={i}
            position={[-10 + col * 5, -4 + row * 2, -6 - Math.random() * 4]}
            height={0.3 + Math.random() * 1.5}
            color={Math.random() > 0.6 ? "#00ff88" : "#ff4444"}
          />
        );
      })}

      {/* Right side candlesticks */}
      {Array.from({ length: 15 }).map((_, i) => (
        <AnimatedCandlestick
          key={`right-${i}`}
          position={[8 + Math.random() * 4, -3 + i * 0.8, -5 - Math.random() * 3]}
          height={0.4 + Math.random() * 1.2}
          color={Math.random() > 0.5 ? "#00aaff" : "#ff6666"}
        />
      ))}

      {/* Stock Chart Lines */}
      <StockChartLine color="#ff0080" yOffset={0} />
      <StockChartLine color="#00aaff" yOffset={2} />

      {/* Grid Lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`h-grid-${i}`} position={[0, -6 + i * 0.8, -8]} scale={[25, 0.005, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#1a1a3a" transparent opacity={0.2} />
        </mesh>
      ))}

      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`v-grid-${i}`} position={[-12 + i * 1.2, 0, -8]} scale={[0.005, 15, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#1a1a3a" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Glowing orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`orb-${i}`} position={[
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          -10 - Math.random() * 5
        ]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial 
            color={Math.random() > 0.5 ? "#00ffff" : "#ff00ff"} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}
    </>
  );
}

// HTML UI Overlay Component (Standalone version)
function UIOverlay() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful! (Demo)');
    }, 2000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (!registerForm.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      alert('Registration successful! (Demo)');
    }, 2000);
  };

  return (
    <Html center>
      <div className="relative w-screen h-screen flex items-center justify-center">
        {/* Stock Data Overlays - Left Side */}
        <div className="absolute left-6 top-1/4 text-left space-y-6 z-10 font-mono">
          <div className="text-cyan-400 text-2xl font-bold stock-ticker">/ +2.4%</div>
          <div className="text-orange-400 text-2xl font-bold stock-ticker">↗ +1.0%</div>
          <div className="text-red-400 text-2xl font-bold stock-ticker">↘ -0.3%</div>
          <div className="bg-cyan-400 px-4 py-2 rounded-lg text-black font-bold text-base mt-6 shadow-lg shadow-cyan-400/50">
            📈 BULL
          </div>
        </div>

        {/* Stock Data Overlays - Right Side */}
        <div className="absolute right-6 top-1/4 text-right space-y-6 z-10 font-mono">
          <div className="text-cyan-400 text-2xl font-bold stock-ticker">+2.4%</div>
          <div className="text-pink-400 text-2xl font-bold stock-ticker">+ QQQR</div>
          <div className="text-pink-400 text-2xl font-bold stock-ticker">↘ 0.9%</div>
        </div>

        {/* Bottom Right BULL indicator */}
        <div className="absolute bottom-20 right-20 text-9xl font-bold text-cyan-400 opacity-25 font-mono stock-ticker">
          BULL
        </div>

        {/* Main Login Form */}
        <div className="relative z-20">
          {/* Outer glow container */}
          <div className="relative">
            {/* Multiple glow layers */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-3xl blur-3xl scale-110"></div>
            <div className="absolute inset-0 bg-purple-400/10 rounded-3xl blur-2xl scale-105"></div>
            <div className="absolute inset-0 bg-cyan-400/30 rounded-2xl blur-xl"></div>
            
            <div className="relative form-container rounded-3xl p-12 w-[450px] shadow-2xl">
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-6xl font-bold mb-4 tracking-wide">
                  <span className="text-cyan-400 drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.8)' }}>Stock</span>
                  <span className="text-white drop-shadow-2xl">Learn</span>
                </h1>
                <p className="text-gray-300 text-lg font-medium">Master stock market investing with interactive</p>
              </div>

              {/* Tabs */}
              <div className="flex mb-10 bg-gray-900/60 rounded-xl p-2 border border-cyan-400/40">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-4 px-8 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    activeTab === 'login'
                      ? 'active-tab text-cyan-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-4 px-8 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    activeTab === 'register'
                      ? 'active-tab text-cyan-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-8">
                  {/* Email Field */}
                  <div>
                    <label className="block text-cyan-400 text-base font-semibold mb-4 tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="Enter your email"
                      className="neon-input w-full px-6 py-5 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg font-medium rounded-xl"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-cyan-400 text-base font-semibold mb-4 tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="neon-input w-full px-6 py-5 pr-16 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg font-medium rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="neon-checkbox w-6 h-6 rounded-md mr-4"
                    />
                    <label htmlFor="remember" className="text-cyan-400 text-lg font-medium">
                      Remember me
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-400 text-base text-center bg-red-400/10 border-2 border-red-400/30 rounded-xl p-5 font-medium">
                      {error}
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="neon-button w-full py-5 text-black font-bold text-xl rounded-xl focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-cyan-400 text-base font-semibold mb-3 tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="neon-input w-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg font-medium rounded-xl"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-cyan-400 text-base font-semibold mb-3 tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="Enter your email"
                      className="neon-input w-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg font-medium rounded-xl"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-cyan-400 text-base font-semibold mb-3 tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="Enter your password"
                        className="neon-input w-full px-6 py-4 pr-16 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg font-medium rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-cyan-400 text-base font-semibold mb-3 tracking-wide">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      className="neon-input w-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg font-medium rounded-xl"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={registerForm.agreeToTerms}
                      onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                      className="neon-checkbox w-6 h-6 rounded-md mr-4 mt-1"
                    />
                    <label htmlFor="terms" className="text-cyan-400 text-lg font-medium">
                      I agree to the Terms and Conditions
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-400 text-base text-center bg-red-400/10 border-2 border-red-400/30 rounded-xl p-4 font-medium">
                      {error}
                    </div>
                  )}

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="neon-button w-full py-5 text-black font-bold text-xl rounded-xl focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Register'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
}

// Main Component
export function StandaloneThreeJSLogin() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <BackgroundScene />
        <UIOverlay />
      </Canvas>
    </div>
  );
}

export default StandaloneThreeJSLogin;
