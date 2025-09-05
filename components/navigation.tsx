'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Play,
  CheckSquare,
  Languages,
  User,
  TrendingUp,
  Award,
  MessageSquare,
  BarChart3,
  Zap,
  Target,
  Gamepad2,
  Brain,
  Cpu
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useGamification } from '@/contexts/GamificationContext';

const navigationItems = [
  {
    name: 'Learn',
    href: '/learn',
    icon: BookOpen,
    description: 'AI-powered adaptive learning'
  },
  {
    name: 'Practice',
    href: '/practice',
    icon: Play,
    description: 'Advanced trading simulator'
  },
  {
    name: 'Algo Trading',
    href: '/algo-trading',
    icon: Cpu,
    description: 'Algorithmic trading education'
  },
  {
    name: 'Interactive',
    href: '/interactive',
    icon: Brain,
    description: '3D visualizations & scenarios'
  },
  {
    name: 'Gamification',
    href: '/gamification',
    icon: Gamepad2,
    description: 'Achievements & leaderboards'
  },
  {
    name: 'Assess',
    href: '/assess',
    icon: CheckSquare,
    description: 'Adaptive quizzes & evaluations'
  },
  {
    name: 'Analytics',
    href: '/progress-analytics',
    icon: BarChart3,
    description: 'AI-driven progress insights'
  },
  {
    name: 'Translate',
    href: '/translate',
    icon: Languages,
    description: 'Multi-language support'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Personal dashboard & achievements'
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const { state } = useGamification();
  const { userProfile } = state;

  return (
    <nav className="hidden md:flex md:flex-col md:w-64 md:bg-background md:border-r md:border-border">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4 border-b border-border">
          <TrendingUp className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-xl font-bold text-foreground">StockLearn Pro</h1>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg transition-colors group',
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 mr-3',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                )} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {userProfile ? `Level ${userProfile.level}` : 'Beginner Level'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {userProfile ? `${userProfile.xp}/${userProfile.xpToNextLevel} XP` : '250 XP to next level'}
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
          {userProfile && (
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{userProfile.achievements.length} achievements</span>
              <span>{userProfile.totalPoints} points</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function TopNavigation() {
  return (
    <nav className="bg-background border-b border-border px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-foreground">StockLearn</h1>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button 
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Achievements"
          >
            <Award className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="flex">
        <SidebarNavigation />
        <main className="flex-1 md:ml-0">
          <div className="pb-16 md:pb-0">
            {children}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}
