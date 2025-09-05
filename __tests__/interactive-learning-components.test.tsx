import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Portfolio3DVisualization } from '@/components/interactive-learning-components';
import { InteractiveRiskAssessmentTool } from '@/components/interactive-learning-components';
import { MarketScenarioSimulator } from '@/components/interactive-learning-components';

describe('Interactive Learning Components', () => {
  describe('Portfolio3DVisualization', () => {
    const mockPortfolio = {
      stocks: [
        { symbol: 'AAPL', shares: 100, currentPrice: 175.50, change: 2.5, weight: 25 },
        { symbol: 'GOOGL', shares: 50, currentPrice: 135.20, change: -1.2, weight: 20 },
      ],
      totalValue: 125000,
      totalChange: 1.8
    };

    it('renders portfolio data correctly', () => {
      render(<Portfolio3DVisualization portfolio={mockPortfolio} />);

      expect(screen.getByText('Total Value: $1,25,000')).toBeTruthy();
      expect(screen.getByText('+1.80%')).toBeTruthy();
      expect(screen.getByText('AAPL')).toBeTruthy();
      expect(screen.getByText('GOOGL')).toBeTruthy();
    });

    it('displays portfolio statistics', () => {
      render(<Portfolio3DVisualization portfolio={mockPortfolio} />);

      expect(screen.getByText('3D Portfolio Visualization')).toBeTruthy();
    });
  });

  describe('InteractiveRiskAssessmentTool', () => {
    const mockUserProfile = {
      riskTolerance: 'moderate' as const,
      investmentGoals: ['growth', 'income'],
      timeHorizon: 10,
      currentPortfolio: []
    };

    const mockOnRiskUpdate = jest.fn();

    it('renders risk assessment interface', () => {
      render(
        <InteractiveRiskAssessmentTool
          userProfile={mockUserProfile}
          onRiskUpdate={mockOnRiskUpdate}
        />
      );

      expect(screen.getByText('Risk Tolerance Assessment')).toBeTruthy();
      expect(screen.getByText('How would you react if your investment lost 20% in a month?')).toBeTruthy();
    });

    it('calls onRiskUpdate when risk tolerance changes', async () => {
      render(
        <InteractiveRiskAssessmentTool
          userProfile={mockUserProfile}
          onRiskUpdate={mockOnRiskUpdate}
        />
      );

      // Answer all questions to complete the assessment
      // Question 1: Buy more at the lower price (score 4)
      const aggressiveButton = screen.getByText('Buy more at the lower price');
      fireEvent.click(aggressiveButton);

      // Question 2: More than 7 years (score 4)
      await waitFor(() => {
        expect(screen.getByText('More than 7 years')).toBeTruthy();
      });
      const longTermButton = screen.getByText('More than 7 years');
      fireEvent.click(longTermButton);

      // Question 3: 80-100% (score 4)
      await waitFor(() => {
        expect(screen.getByText('80-100%')).toBeTruthy();
      });
      const highStockButton = screen.getByText('80-100%');
      fireEvent.click(highStockButton);

      // Wait for the results to show
      await waitFor(() => {
        expect(screen.getByText('Update My Profile')).toBeTruthy();
      });

      // Click the update button
      const updateButton = screen.getByText('Update My Profile');
      fireEvent.click(updateButton);

      expect(mockOnRiskUpdate).toHaveBeenCalledWith('aggressive');
    });
  });

  describe('MarketScenarioSimulator', () => {
    const mockScenarios = [
      {
        id: 'bull-market',
        name: 'Bull Market Rally',
        description: 'Experience a strong market uptrend',
        marketCondition: 'bull' as const,
        initialPortfolio: 100000,
        events: [
          { day: 5, event: 'Fed Interest Rate Cut', impact: 3, description: 'Positive economic news' }
        ]
      }
    ];

    const mockOnScenarioComplete = jest.fn();

    it('renders scenario selection', () => {
      render(
        <MarketScenarioSimulator
          scenarios={mockScenarios}
          onScenarioComplete={mockOnScenarioComplete}
        />
      );

      expect(screen.getByText('Bull Market Rally')).toBeTruthy();
      expect(screen.getByText('Experience a strong market uptrend')).toBeTruthy();
    });
  });
});
