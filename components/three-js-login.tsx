'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm, RegisterForm } from '@/lib/types';
import { Eye, EyeOff } from 'lucide-react';

// Animated Candlestick Component
function AnimatedCandlestick({ position, height, color }: { position: [number, number, number], height: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wickRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
    if (wickRef.current) {
      wickRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
  });

  return (
    <group>
      {/* Candlestick body */}
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.3, height, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      {/* Candlestick wick */}
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

  useEffect(() => {
    if (particlesRef.current) {
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
      particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        positions[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.6} />
    </points>
  );
}

// Stock Chart Line Component
function StockChartLine() {
  const lineRef = useRef<THREE.Line>(null);
  const points = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    // Create multiple zigzag line patterns for stock chart
    const pointsArray = [];
    for (let i = 0; i < 30; i++) {
      pointsArray.push(new THREE.Vector3(
        -15 + i * 1,
        Math.sin(i * 0.3) * 3 + Math.cos(i * 0.7) * 1.5,
        -3
      ));
    }
    points.current = pointsArray;
  }, []);

  useFrame((state) => {
    if (lineRef.current && points.current.length > 0) {
      const time = state.clock.elapsedTime * 0.5;
      points.current.forEach((point, i) => {
        point.y = Math.sin(i * 0.3 + time) * 3 + Math.cos(i * 0.7 + time * 1.5) * 1.5 + Math.sin(time * 2 + i) * 0.2;
      });
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points.current);
      if (lineRef.current.geometry) {
        lineRef.current.geometry.dispose();
      }
      lineRef.current.geometry = geometry;
    }
  });

  return (
    <primitive object={new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points.current),
      new THREE.LineBasicMaterial({ color: '#ff0080', linewidth: 3 })
    )} ref={lineRef} />
  );
}

// Additional Chart Lines
function ChartLines() {
  const points = Array.from({ length: 20 }, (_, i) => new THREE.Vector3(
    -10 + i * 1,
    Math.sin(i * 0.2) * 2 + 1,
    -4
  ));

  return (
    <>
      <StockChartLine />
      {/* Blue trending line */}
      <primitive object={new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: '#00aaff', linewidth: 2 })
      )} />
    </>
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
      
      {/* Purple-Pink gradient overlay */}
      <mesh position={[0, 0, -14]} scale={[60, 60, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color="#1a0a2e" 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Animated Candlesticks - Multiple rows */}
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
      <ChartLines />

      {/* Grid Lines - Horizontal */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`h-grid-${i}`} position={[0, -6 + i * 0.8, -8]} scale={[25, 0.005, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#1a1a3a" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Grid Lines - Vertical */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`v-grid-${i}`} position={[-12 + i * 1.2, 0, -8]} scale={[0.005, 15, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#1a1a3a" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Glowing orbs for ambiance */}
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

// HTML UI Overlay Component
function UIOverlay() {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    agreeToTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(loginForm);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    
    if (registerForm.password.length < 8) {
      console.error('Password must be at least 8 characters long');
      return;
    }
    
    if (!registerForm.agreeToTerms) {
      console.error('You must agree to the terms and conditions');
      return;
    }

    await register(registerForm);
  };

  return (
    <Html center>
      <div className="relative w-screen h-screen flex items-center justify-center">
        {/* Stock Data Overlays - Left Side */}
        <div className="absolute left-4 top-1/4 text-left space-y-6 z-10 font-mono">
          <div className="text-cyan-400 text-xl font-bold">/ +2.4%</div>
          <div className="text-orange-400 text-xl font-bold">↗ +1.0%</div>
          <div className="text-red-400 text-xl font-bold">↘ -0.3%</div>
          <div className="bg-cyan-400 px-3 py-2 rounded-md text-black font-bold text-sm mt-4">
            📈 BULL
          </div>
        </div>

        {/* Stock Data Overlays - Right Side */}
        <div className="absolute right-4 top-1/4 text-right space-y-6 z-10 font-mono">
          <div className="text-cyan-400 text-xl font-bold">+2.4%</div>
          <div className="text-pink-400 text-xl font-bold">+ QQQR</div>
          <div className="text-pink-400 text-xl font-bold">↘ 0.9%</div>
        </div>

        {/* Bottom Right BULL indicator */}
        <div className="absolute bottom-16 right-16 text-8xl font-bold text-cyan-400 opacity-30 font-mono">
          BULL
        </div>

        {/* Main Login Form */}
        <div className="relative z-20">
          {/* Outer glow container */}
          <div className="relative">
            {/* Multiple glow layers for enhanced effect */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-3xl blur-3xl scale-110"></div>
            <div className="absolute inset-0 bg-purple-400/10 rounded-3xl blur-2xl scale-105"></div>
            <div className="absolute inset-0 bg-cyan-400/30 rounded-2xl blur-xl"></div>
            
            <div className="relative bg-black/90 backdrop-blur-xl border-2 border-cyan-400 rounded-2xl p-10 w-[420px] shadow-2xl shadow-cyan-400/40">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-3 tracking-wide">
                  <span className="text-cyan-400 drop-shadow-lg">Stock</span>
                  <span className="text-white drop-shadow-lg">Learn</span>
                </h1>
                <p className="text-gray-300 text-base font-medium">Master stock market investing with interactive</p>
              </div>

              {/* Tabs */}
              <div className="flex mb-8 bg-gray-900/60 rounded-xl p-1.5 border border-cyan-400/40">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300 ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-cyan-400/30 to-cyan-500/30 text-cyan-400 border border-cyan-400/60 shadow-lg shadow-cyan-400/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300 ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-cyan-400/30 to-cyan-500/30 text-cyan-400 border border-cyan-400/60 shadow-lg shadow-cyan-400/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Register
                </button>
              </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-cyan-400 text-sm font-semibold mb-3 tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 bg-gray-900/80 border-2 border-cyan-400/40 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 text-base font-medium"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-cyan-400 text-sm font-semibold mb-3 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full px-5 py-4 pr-14 bg-gray-900/80 border-2 border-cyan-400/40 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 text-base font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
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
                    className="w-5 h-5 text-cyan-400 bg-gray-900 border-2 border-cyan-400/40 rounded-md focus:ring-cyan-400/20 focus:ring-2 accent-cyan-400"
                  />
                  <label htmlFor="remember" className="ml-4 text-cyan-400 text-base font-medium">
                    Remember me
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-400/10 border-2 border-red-400/30 rounded-xl p-4 font-medium">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 text-black font-bold text-lg rounded-xl hover:from-cyan-300 hover:via-cyan-400 hover:to-cyan-300 focus:ring-4 focus:ring-cyan-400/30 focus:outline-none transition-all duration-300 shadow-xl shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
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
                  <label className="block text-cyan-400 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-900/70 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-cyan-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-900/70 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-cyan-400 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-12 bg-gray-900/70 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-cyan-400 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-gray-900/70 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={registerForm.agreeToTerms}
                    onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                    className="w-4 h-4 text-cyan-400 bg-gray-900 border-cyan-400/30 rounded focus:ring-cyan-400/20 focus:ring-2 mt-1"
                  />
                  <label htmlFor="terms" className="ml-3 text-cyan-400 text-sm">
                    I agree to the Terms and Conditions
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                    {error}
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-medium rounded-lg hover:from-cyan-500 hover:to-cyan-600 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all shadow-lg shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
export function ThreeJSLogin() {
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

export default ThreeJSLogin;
