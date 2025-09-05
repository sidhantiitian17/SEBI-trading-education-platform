import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '@/components/dashboard-header';
import '@testing-library/jest-dom';

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href}`}>{children}</a>
  ),
}));

describe('DashboardHeader', () => {
  it('renders the header with logo and title', () => {
    render(<DashboardHeader />);

    expect(screen.getByText('StockLearn')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument(); // TrendingUp icon
  });

  it('renders beta badge', () => {
    render(<DashboardHeader />);

    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('renders navigation links on desktop', () => {
    render(<DashboardHeader />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tutorials')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Trading Sim')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Market Center')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<DashboardHeader />);

    expect(screen.getByTestId('link-/tutorials')).toHaveAttribute('href', '/tutorials');
    expect(screen.getByTestId('link-/quizzes')).toHaveAttribute('href', '/quizzes');
    expect(screen.getByTestId('link-/trading')).toHaveAttribute('href', '/trading');
    expect(screen.getByTestId('link-/portfolio')).toHaveAttribute('href', '/portfolio');
    expect(screen.getByTestId('link-/market')).toHaveAttribute('href', '/market');
    expect(screen.getByTestId('link-/progress')).toHaveAttribute('href', '/progress');
  });

  it('renders action buttons', () => {
    render(<DashboardHeader />);

    // Check for buttons with icons (Bell, Settings, User)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3); // Dashboard + 3 icon buttons
  });

  it('renders with correct CSS classes', () => {
    render(<DashboardHeader />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b', 'bg-card/50', 'backdrop-blur-sm', 'sticky', 'top-0', 'z-50');
  });

  it('renders responsive navigation', () => {
    render(<DashboardHeader />);

    // Check that desktop navigation is hidden on mobile
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden', 'md:flex');
  });
});
