import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/hero';
import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

// Mock LazyVideo component
jest.mock('@/components/lazy-video', () => ({
  __esModule: true,
  default: ({ src, className, autoplay, loop, muted, playsInline, 'aria-label': ariaLabel }: any) => (
    <video
      src={src}
      className={className}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      aria-label={ariaLabel}
      data-testid="lazy-video"
    />
  ),
}));

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { name: /high-impact/i })).toBeInTheDocument();
  });

  it('renders the logo and brand text', () => {
    render(<Hero />);

    expect(screen.getByAltText('Skitbit logo')).toBeInTheDocument();
    expect(screen.getByText('skitbit')).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<Hero />);

    expect(screen.getByText('HIGH-IMPACT')).toBeInTheDocument();
    expect(screen.getByText('3D ANIMATION')).toBeInTheDocument();
    expect(screen.getByText('FOR BRANDS')).toBeInTheDocument();
  });

  it('renders the call-to-action button', () => {
    render(<Hero />);

    const button = screen.getByRole('link', { name: /chat with us/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', 'https://wa.link/rc25na');
    expect(button).toHaveAttribute('target', '_blank');
  });

  it('renders phone cards', () => {
    render(<Hero />);

    // Check for phone card titles
    expect(screen.getByText('Conversions')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Social-Ready')).toBeInTheDocument();
    expect(screen.getByText('Standout')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders phone card subtitles', () => {
    render(<Hero />);

    expect(screen.getByText('Turn clicks into paying customers.')).toBeInTheDocument();
    expect(screen.getByText('Launch in days, not weeks.')).toBeInTheDocument();
    expect(screen.getByText('Made for IG, TikTok, and Meta.')).toBeInTheDocument();
  });

  it('renders video elements in phone cards', () => {
    render(<Hero />);

    const videos = screen.getAllByTestId('lazy-video');
    expect(videos.length).toBeGreaterThan(0);
  });

  it('renders responsive phone grid', () => {
    render(<Hero />);

    const grid = screen.getByText('Conversions').closest('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'xl:grid-cols-5');
  });

  it('renders correct number of visible phone cards', () => {
    render(<Hero />);

    // Should render 5 phone cards total, but some are hidden based on screen size
    const phoneCards = screen.getAllByText(/Conversions|Speed|Social-Ready|Standout|Premium/);
    expect(phoneCards).toHaveLength(5);
  });

  it('renders phone cards with correct accessibility labels', () => {
    render(<Hero />);

    const videos = screen.getAllByTestId('lazy-video');
    videos.forEach(video => {
      expect(video).toHaveAttribute('aria-label');
    });
  });
});
