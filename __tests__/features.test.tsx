import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Features } from '@/components/features';
import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, className, sizes, priority, width, height }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      data-fill={fill}
      data-sizes={sizes}
      data-priority={priority}
    />
  ),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the features section', () => {
    render(<Features />);

    expect(screen.getByRole('heading', { name: /what makes us the best studio/i })).toBeInTheDocument();
  });

  it('renders default title', () => {
    render(<Features />);

    expect(screen.getByText('What makes us the best studio for you.')).toBeInTheDocument();
  });

  it('loads content from localStorage on mount', async () => {
    const mockContent = {
      features: {
        title: 'Custom Title',
        subtitle: 'Custom Subtitle',
      },
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockContent));

    render(<Features />);

    // Wait for the useEffect to run and update the state
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('skitbit-content');
  });

  it('renders client love card', () => {
    render(<Features />);

    expect(screen.getByText('CLIENT LOVE')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText(/Their work didn't just look good/)).toBeInTheDocument();
  });

  it('renders star ratings', () => {
    render(<Features />);

    // Stars are SVG elements from lucide-react
    const starSvg = document.querySelectorAll('svg[class*="fill-lime-300"]');
    expect(starSvg).toHaveLength(5);
  });

  it('renders adaptability card on desktop only', () => {
    render(<Features />);

    // On desktop, adaptability card should be visible
    const adaptabilityCard = screen.queryByText('ADAPTABILITY');
    expect(adaptabilityCard).toBeInTheDocument();

    // Check that it has hidden md:block class
    const card = adaptabilityCard?.closest('[class*="hidden md:block"]');
    expect(card).toBeInTheDocument();
  });

  it('renders images with correct alt text', () => {
    render(<Features />);

    expect(screen.getByAltText('Close-up smartphone camera module on textured leather back')).toBeInTheDocument();
    expect(screen.getByAltText('Hand gripping textured phone back — macro detail')).toBeInTheDocument();
    expect(screen.getByAltText('Product sketch concepts of backpack on paper')).toBeInTheDocument();
    expect(screen.getByAltText('Backpacks on stage with Smartpack PRO lighting')).toBeInTheDocument();
  });

  it('handles localStorage parsing errors gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');

    // Mock console.error to avoid test output pollution
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Features />);

    // Should still render default content
    expect(screen.getByText('What makes us the best studio for you.')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders responsive grid layout', () => {
    render(<Features />);

    // Look for the grid container div
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass('md:grid-cols-2');
  });
});
