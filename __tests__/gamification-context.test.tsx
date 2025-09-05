import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { GamificationProvider, useGamification } from '@/contexts/GamificationContext';

// Mock the gamification engine
jest.mock('@/lib/gamification-engine', () => ({
  gamificationEngine: {
    getUserProfile: jest.fn(),
    checkAchievements: jest.fn(),
    updateProgress: jest.fn(),
    claimDailyChallengeReward: jest.fn(),
  },
}));

const mockGamificationEngine = require('@/lib/gamification-engine').gamificationEngine;

describe('Gamification Context', () => {
  const mockUserProfile = {
    userId: 'test-user',
    level: 5,
    xp: 2500,
    xpToNextLevel: 500,
    totalPoints: 1500,
    achievements: [],
    streaks: [],
    dailyChallenges: [],
    weeklyGoals: [],
    leaderboardPosition: 10,
    rank: {
      name: 'Expert',
      level: 5,
      icon: '⭐',
      color: '#FFD700',
      requirements: {
        minLevel: 5,
        minXP: 2000,
        achievementsRequired: 10,
      },
    },
    stats: {
      totalModulesCompleted: 25,
      totalQuizzesTaken: 15,
      averageQuizScore: 85,
      totalTradingVolume: 100000,
      totalTradingProfit: 5000,
      winRate: 65,
      longestLearningStreak: 7,
      totalTimeSpent: 1200,
      socialInteractions: 50,
      strategiesCreated: 3,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGamificationEngine.getUserProfile.mockReturnValue(mockUserProfile);
    mockGamificationEngine.checkAchievements.mockReturnValue([]);
    mockGamificationEngine.updateProgress.mockReturnValue(undefined);
    mockGamificationEngine.claimDailyChallengeReward.mockReturnValue(true);
  });

  const TestComponent = () => {
    const { state, actions } = useGamification();

    return (
      <div>
        <div data-testid="user-level">{state.userProfile?.level}</div>
        <div data-testid="user-xp">{state.userProfile?.xp}</div>
        <button onClick={() => actions.loadUserProfile('test-user')}>
          Load Profile
        </button>
        <button onClick={() => actions.checkAchievements('test-user', 'module_complete')}>
          Check Achievements
        </button>
      </div>
    );
  };

  it('provides gamification context to child components', () => {
    render(
      <GamificationProvider>
        <TestComponent />
      </GamificationProvider>
    );

    expect(screen.getByTestId('user-level')).toBeInTheDocument();
    expect(screen.getByTestId('user-xp')).toBeInTheDocument();
  });

  it('loads user profile when loadUserProfile is called', async () => {
    render(
      <GamificationProvider>
        <TestComponent />
      </GamificationProvider>
    );

    const loadButton = screen.getByText('Load Profile');
    
    await act(async () => {
      loadButton.click();
    });

    await waitFor(() => {
      expect(mockGamificationEngine.getUserProfile).toHaveBeenCalledWith('test-user');
    });
  });

  it('checks achievements when checkAchievements is called', async () => {
    render(
      <GamificationProvider>
        <TestComponent />
      </GamificationProvider>
    );

    const checkButton = screen.getByText('Check Achievements');
    
    await act(async () => {
      checkButton.click();
    });

    await waitFor(() => {
      expect(mockGamificationEngine.checkAchievements).toHaveBeenCalledWith('test-user', 'module_complete', undefined);
    });
  });

  it('throws error when useGamification is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGamification must be used within a GamificationProvider');

    consoleSpy.mockRestore();
  });
});
