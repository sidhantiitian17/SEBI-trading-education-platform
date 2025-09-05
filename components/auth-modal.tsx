'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm, RegisterForm } from '@/lib/types';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function AuthModal() {
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
    
    // Password validation
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

  const handleLoginChange = (field: keyof LoginForm, value: any) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = (field: keyof RegisterForm, value: any) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
         style={{
           background: 'radial-gradient(ellipse at center, rgba(30, 10, 60, 0.6) 0%, rgba(10, 5, 25, 0.9) 40%, rgba(5, 5, 15, 1) 100%), linear-gradient(135deg, #0a0414 0%, #1a0a2a 25%, #2a1545 50%, #0f051a 75%, #050510 100%)'
         }}>
      
      {/* Financial Chart Background with Enhanced Styling */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Candlestick Chart Simulation */}
        <div className="absolute inset-0 opacity-40">
          {/* Trending Line - Pink/Magenta */}
          <svg className="absolute right-0 top-1/4 w-2/3 h-1/2" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff1744" />
                <stop offset="50%" stopColor="#e91e63" />
                <stop offset="100%" stopColor="#ff6b9d" />
              </linearGradient>
            </defs>
            <path
              d="M50,150 Q150,100 250,80 T350,50"
              stroke="url(#trendGradient)"
              strokeWidth="4"
              fill="none"
              className="animate-pulse"
            />
          </svg>
          
          {/* Enhanced Candlestick Bars */}
          <div className="absolute right-20 top-20 space-y-2">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex items-end space-x-1">
                <div 
                  className={`w-4 ${Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-red-400'} opacity-80 rounded-sm`}
                  style={{ height: `${Math.random() * 50 + 15}px` }}
                />
                <div 
                  className={`w-4 ${Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-red-400'} opacity-80 rounded-sm`}
                  style={{ height: `${Math.random() * 50 + 15}px` }}
                />
                <div 
                  className={`w-4 ${Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-red-400'} opacity-80 rounded-sm`}
                  style={{ height: `${Math.random() * 50 + 15}px` }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Grid Lines */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full grid grid-cols-16 grid-rows-12">
            {[...Array(192)].map((_, i) => (
              <div key={i} className="border border-cyan-400/30" />
            ))}
          </div>
        </div>
      </div>

      {/* Market Indicators - Top Left - Exact positioning */}
      <div className="absolute left-10 top-24 space-y-4 z-20">
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 text-xl font-bold">↗</span>
          <span className="text-cyan-400 text-2xl font-bold">+2.4%</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-red-400 text-xl font-bold">↗</span>
          <span className="text-red-400 text-2xl font-bold">+1.0%</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-red-400 text-xl font-bold">↘</span>
          <span className="text-red-400 text-2xl font-bold">-0.3%</span>
        </div>
        
        {/* BULL indicator with exact styling */}
        <div className="flex items-center space-x-4 mt-10">
          <div className="w-10 h-10 bg-cyan-400 rounded-md flex items-center justify-center shadow-lg">
            <span className="text-black text-xl font-black">B</span>
          </div>
          <span className="text-cyan-400 font-black text-3xl tracking-widest">BULL</span>
        </div>
      </div>

      {/* Bottom Left Market Indicators - Exact positioning */}
      <div className="absolute left-10 bottom-48 space-y-4 z-20">
        <div className="text-cyan-400 text-xl font-bold">+2.4%</div>
        <div className="text-pink-400 text-xl font-bold">+QQQR</div>
        <div className="flex items-center space-x-3">
          <span className="text-red-400 text-xl font-bold">↘</span>
          <span className="text-red-400 text-xl font-bold">0.9%</span>
        </div>
      </div>

      {/* Large BULL Text - Bottom Right - Exact styling */}
      <div className="absolute right-20 bottom-24 z-20">
        <span 
          className="text-cyan-300 font-black tracking-[0.5em] opacity-80"
          style={{ 
            fontSize: '9rem',
            fontFamily: 'Arial Black, sans-serif',
            textShadow: '0 0 40px rgba(0, 188, 212, 0.4)',
            letterSpacing: '0.3em'
          }}
        >
          BULL
        </span>
      </div>
      
      {/* Main Login Interface - Enhanced */}
      <div 
        className="relative z-30 w-full max-w-lg mx-auto p-12"
        style={{
          background: 'rgba(8, 20, 40, 0.9)',
          border: '3px solid #00bcd4',
          borderRadius: '28px',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 0 60px rgba(0, 188, 212, 0.3), inset 0 0 40px rgba(0, 188, 212, 0.08)'
        }}
      >
        {/* Title Section - Enhanced */}
        <div className="text-center mb-12">
          <h1 
            className="font-black mb-5"
            style={{ 
              fontSize: '4rem',
              color: '#00bcd4',
              textShadow: '0 0 30px rgba(0, 188, 212, 0.6)',
              letterSpacing: '0.03em',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            StockLearn
          </h1>
          <p 
            className="text-2xl font-bold"
            style={{ 
              color: '#e91e63',
              letterSpacing: '0.02em'
            }}
          >
            Master stock market investing with interactive
          </p>
        </div>

        {/* Tab Navigation - Enhanced styling */}
        <div 
          className="flex mb-10 rounded-3xl overflow-hidden"
          style={{ border: '3px solid #00bcd4' }}
        >
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-6 px-10 font-black text-2xl transition-all duration-300 ${
              activeTab === 'login'
                ? 'text-cyan-400'
                : 'text-cyan-400/60'
            }`}
            style={{
              background: activeTab === 'login' ? 'rgba(0, 188, 212, 0.2)' : 'transparent',
              borderRight: '2px solid #00bcd4'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-6 px-10 font-black text-2xl transition-all duration-300 ${
              activeTab === 'register'
                ? 'text-cyan-400'
                : 'text-cyan-400/60'
            }`}
            style={{
              background: activeTab === 'register' ? 'rgba(0, 188, 212, 0.2)' : 'transparent'
            }}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-10">
            {/* Email Field - Enhanced */}
            <div className="space-y-5">
              <label className="text-cyan-400 text-xl font-bold block">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => handleLoginChange('email', e.target.value)}
                className="w-full py-6 px-8 text-xl font-semibold text-cyan-400 placeholder-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                style={{
                  background: 'rgba(3, 12, 30, 0.8)',
                  border: '3px solid #00bcd4',
                  borderRadius: '20px',
                  boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)'
                }}
                required
              />
            </div>

            {/* Password Field - Enhanced */}
            <div className="space-y-5">
              <label className="text-cyan-400 text-xl font-bold block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => handleLoginChange('password', e.target.value)}
                  className="w-full py-6 px-8 pr-20 text-xl font-semibold text-cyan-400 placeholder-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                  style={{
                    background: 'rgba(3, 12, 30, 0.8)',
                    border: '3px solid #00bcd4',
                    borderRadius: '20px',
                    boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-cyan-400/70 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-7 w-7" /> : <Eye className="h-7 w-7" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox - Enhanced */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(e) => handleLoginChange('rememberMe', e.target.checked)}
                  className="w-7 h-7 rounded-lg border-3 border-cyan-400 bg-transparent focus:ring-0 appearance-none cursor-pointer"
                  style={{
                    background: loginForm.rememberMe ? '#00bcd4' : 'transparent',
                    borderWidth: '3px'
                  }}
                />
                {loginForm.rememberMe && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <label htmlFor="remember-me" className="text-cyan-400/90 text-xl font-semibold cursor-pointer">
                Remember me
              </label>
            </div>

            {error && (
              <div className="p-5 bg-red-500/25 border-2 border-red-500/60 rounded-2xl text-red-400 text-lg font-medium">
                {error}
              </div>
            )}

            {/* Login Button - Enhanced to match image exactly */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-black font-black text-2xl rounded-3xl transition-all duration-300 flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #00bcd4 0%, #26c6da 50%, #4dd0e1 100%)',
                boxShadow: '0 12px 40px rgba(0, 188, 212, 0.5), 0 0 30px rgba(0, 188, 212, 0.3)',
                border: '2px solid #00bcd4'
              }}
            >
              {isLoading && <Loader2 className="h-7 w-7 animate-spin" />}
              <span>Login</span>
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-4">
              <label className="text-cyan-400 text-xl font-bold block">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={registerForm.name}
                onChange={(e) => handleRegisterChange('name', e.target.value)}
                className="w-full py-6 px-8 text-xl font-semibold text-cyan-400 placeholder-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                style={{
                  background: 'rgba(3, 12, 30, 0.8)',
                  border: '3px solid #00bcd4',
                  borderRadius: '20px',
                  boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)'
                }}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-cyan-400 text-xl font-bold block">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) => handleRegisterChange('email', e.target.value)}
                className="w-full py-6 px-8 text-xl font-semibold text-cyan-400 placeholder-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                style={{
                  background: 'rgba(3, 12, 30, 0.8)',
                  border: '3px solid #00bcd4',
                  borderRadius: '20px',
                  boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)'
                }}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-cyan-400 text-xl font-bold block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={registerForm.password}
                  onChange={(e) => handleRegisterChange('password', e.target.value)}
                  className="w-full py-6 px-8 pr-20 text-xl font-semibold text-cyan-400 placeholder-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                  style={{
                    background: 'rgba(3, 12, 30, 0.8)',
                    border: '3px solid #00bcd4',
                    borderRadius: '20px',
                    boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-cyan-400/70 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-7 w-7" /> : <Eye className="h-7 w-7" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-cyan-400 text-xl font-bold block">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={registerForm.confirmPassword}
                onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                className="w-full py-6 px-8 text-xl font-semibold text-cyan-400 placeholder-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                style={{
                  background: 'rgba(3, 12, 30, 0.8)',
                  border: '3px solid #00bcd4',
                  borderRadius: '20px',
                  boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)'
                }}
                required
              />
            </div>

            <div className="flex items-center space-x-5">
              <div className="relative">
                <input
                  id="terms"
                  type="checkbox"
                  checked={registerForm.agreeToTerms}
                  onChange={(e) => handleRegisterChange('agreeToTerms', e.target.checked)}
                  className="w-7 h-7 rounded-lg border-3 border-cyan-400 bg-transparent focus:ring-0 appearance-none cursor-pointer"
                  style={{
                    background: registerForm.agreeToTerms ? '#00bcd4' : 'transparent',
                    borderWidth: '3px'
                  }}
                />
                {registerForm.agreeToTerms && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <label htmlFor="terms" className="text-cyan-400/90 text-xl font-semibold cursor-pointer">
                I agree to the Terms and Conditions
              </label>
            </div>

            {error && (
              <div className="p-5 bg-red-500/25 border-2 border-red-500/60 rounded-2xl text-red-400 text-lg font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-black font-black text-2xl rounded-3xl transition-all duration-300 flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #00bcd4 0%, #26c6da 50%, #4dd0e1 100%)',
                boxShadow: '0 12px 40px rgba(0, 188, 212, 0.5), 0 0 30px rgba(0, 188, 212, 0.3)',
                border: '2px solid #00bcd4'
              }}
            >
              {isLoading && <Loader2 className="h-7 w-7 animate-spin" />}
              <span>Register</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
