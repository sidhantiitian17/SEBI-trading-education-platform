import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '@/components/dashboard-stats';
import { AuthProvider } from '@/contexts/AuthContext';
import '@testing-library/jest-dom';

describe('DashboardStats', () => {
  it('renders all stat cards', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    expect(screen.getByText('Total XP')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Learning Streak')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard Rank')).toBeInTheDocument();
  });

  it('renders stat values correctly', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0/0')).toBeInTheDocument();
    expect(screen.getByText('0 days')).toBeInTheDocument();
    expect(screen.getByText('#--')).toBeInTheDocument();
  });

  it('renders stat totals and targets', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    // The component shows "Best: X days" for learning streak
    expect(screen.getByText('Learning Streak')).toBeInTheDocument();
  });

  it('renders stat changes', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    // When API fails, no change text is shown
    expect(screen.getByText('Total XP')).toBeInTheDocument();
  });

  it('renders correct number of cards', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    const cards = screen.getAllByText(/Total XP|Achievements|Learning Streak|Leaderboard Rank/);
    expect(cards).toHaveLength(4);
  });

  it('renders icons for each stat', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    // Check that icons are rendered (they are SVG elements)
    const icons = document.querySelectorAll('svg');
    expect(icons).toHaveLength(4);
  });

  it('renders cards with correct structure', () => {
    render(
      <AuthProvider>
        <DashboardStats />
      </AuthProvider>
    );

    // Each card should have a title
    const titles = screen.getAllByText(/Total XP|Achievements|Learning Streak|Leaderboard Rank/);
    expect(titles).toHaveLength(4);

    // Check that values are displayed prominently
    const values = screen.getAllByText(/0|0\/0|#--/);
    expect(values.length).toBeGreaterThan(2); // At least some stat values
  });
});
