import React from 'react';
import { render, screen } from '@testing-library/react';
import { BottomNavigation, SidebarNavigation, TopNavigation, MainLayout } from '@/components/navigation';
import { GamificationProvider } from '@/contexts/GamificationContext';

// Mock Next.js router
const mockPush = jest.fn();
const mockPathname = '/learn';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush }),
}));

// Mock gamification context
jest.mock('@/contexts/GamificationContext', () => ({
  useGamification: () => ({
    state: {
      userProfile: {
        level: 5,
        xp: 1250,
        xpToNextLevel: 1500,
        achievements: [{ id: '1' }, { id: '2' }, { id: '3' }],
        totalPoints: 2500,
      },
    },
  }),
  GamificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Navigation Components', () => {
  describe('BottomNavigation', () => {
    it('renders all navigation items', () => {
      render(<BottomNavigation />);

      expect(screen.getByText('Learn')).toBeTruthy();
      expect(screen.getByText('Practice')).toBeTruthy();
      expect(screen.getByText('Algo Trading')).toBeTruthy();
      expect(screen.getByText('Interactive')).toBeTruthy();
      expect(screen.getByText('Gamification')).toBeTruthy();
      expect(screen.getByText('Assess')).toBeTruthy();
      expect(screen.getByText('Analytics')).toBeTruthy();
      expect(screen.getByText('Translate')).toBeTruthy();
      expect(screen.getByText('Profile')).toBeTruthy();
    });

    it('highlights active navigation item', () => {
      render(<BottomNavigation />);

      // The Learn item should be active since pathname is '/learn'
      const learnLink = screen.getByText('Learn').closest('a');
      expect(learnLink?.className).toContain('text-primary');
      expect(learnLink?.className).toContain('bg-primary/10');
    });

    it('renders navigation icons', () => {
      render(<BottomNavigation />);

      // Check that icons are rendered (they have specific test ids or can be queried by their SVG content)
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(9); // 9 navigation items
    });
  });

  describe('SidebarNavigation', () => {
    it('renders sidebar with user profile information', () => {
      render(
        <GamificationProvider>
          <SidebarNavigation />
        </GamificationProvider>
      );

      expect(screen.getByText('StockLearn Pro')).toBeTruthy();
      expect(screen.getByText('Level 5')).toBeTruthy();
      expect(screen.getByText('1250/1500 XP')).toBeTruthy();
      expect(screen.getByText('3 achievements')).toBeTruthy();
      expect(screen.getByText('2500 points')).toBeTruthy();
    });

    it('renders all navigation items with descriptions', () => {
      render(
        <GamificationProvider>
          <SidebarNavigation />
        </GamificationProvider>
      );

      expect(screen.getByText('AI-powered adaptive learning')).toBeTruthy();
      expect(screen.getByText('Advanced trading simulator')).toBeTruthy();
      expect(screen.getByText('Algorithmic trading education')).toBeTruthy();
      expect(screen.getByText('3D visualizations & scenarios')).toBeTruthy();
      expect(screen.getByText('Achievements & leaderboards')).toBeTruthy();
    });

    it('shows beginner level when no user profile', () => {
      // Temporarily mock the context to return no user profile
      const originalMock = jest.requireMock('@/contexts/GamificationContext');
      originalMock.useGamification = () => ({
        state: {
          userProfile: null,
        },
      });

      render(
        <GamificationProvider>
          <SidebarNavigation />
        </GamificationProvider>
      );

      expect(screen.getByText('Beginner Level')).toBeTruthy();
      expect(screen.getByText('250 XP to next level')).toBeTruthy();
    });
  });

  describe('TopNavigation', () => {
    it('renders top navigation header', () => {
      render(<TopNavigation />);

      expect(screen.getByText('StockLearn')).toBeTruthy();
      expect(screen.getByRole('button', { name: /message/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /achievements/i })).toBeTruthy();
    });

    it('includes theme toggle', () => {
      render(<TopNavigation />);

      // Theme toggle should be present (implementation details may vary)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3); // Theme toggle + 2 action buttons
    });
  });

  describe('MainLayout', () => {
    it('renders layout with children', () => {
      render(
        <GamificationProvider>
          <MainLayout>
            <div data-testid="test-content">Test Content</div>
          </MainLayout>
        </GamificationProvider>
      );

      expect(screen.getByTestId('test-content')).toBeTruthy();
      expect(screen.getByText('StockLearn')).toBeTruthy();
      expect(screen.getByText('StockLearn Pro')).toBeTruthy();
    });

    it('includes all navigation components', () => {
      render(
        <GamificationProvider>
          <MainLayout>
            <div>Content</div>
          </MainLayout>
        </GamificationProvider>
      );

      // Check for presence of navigation elements
      const learnElements = screen.getAllByText('Learn');
      expect(learnElements.length).toBeGreaterThan(0);
      const practiceElements = screen.getAllByText('Practice');
      expect(practiceElements.length).toBeGreaterThan(0);
      expect(screen.getByText('StockLearn Pro')).toBeTruthy();
    });
  });

  describe('Navigation Links', () => {
    it('generates correct hrefs for navigation items', () => {
      render(<BottomNavigation />);

      const learnLink = screen.getByText('Learn').closest('a');
      expect(learnLink?.getAttribute('href')).toBe('/learn');

      const practiceLink = screen.getByText('Practice').closest('a');
      expect(practiceLink?.getAttribute('href')).toBe('/practice');

      const profileLink = screen.getByText('Profile').closest('a');
      expect(profileLink?.getAttribute('href')).toBe('/profile');
    });

    it('handles active state for nested routes', () => {
      // Mock a nested route
      const originalUsePathname = require('next/navigation').usePathname;
      require('next/navigation').usePathname = () => '/learn/advanced';

      render(<BottomNavigation />);

      const learnLink = screen.getByText('Learn').closest('a');
      expect(learnLink?.className).toContain('text-primary');

      // Restore original
      require('next/navigation').usePathname = originalUsePathname;
    });
  });
});
