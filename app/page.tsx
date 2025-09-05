'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { useTrading } from '@/contexts/TradingContext';
import { MainLayout } from '@/components/navigation';
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { LearningModules } from "@/components/learning-modules"
import { QuickActions } from "@/components/quick-actions"
import { MarketOverview } from "@/components/market-overview"
import { ProgressTracker } from "@/components/progress-tracker"
import { AuthModal } from "@/components/auth-modal"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Page() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: learningLoading } = useLearning();
  const { isLoading: tradingLoading } = useTrading();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 space-y-6">
          {(learningLoading || tradingLoading) && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <DashboardStats />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <LearningModules />
              <QuickActions />
            </div>
            <div className="space-y-6">
              <ProgressTracker />
              <MarketOverview />
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
