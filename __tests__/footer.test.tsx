import { render, screen } from '@testing-library/react'
import { Footer } from '../components/footer'

describe('Footer', () => {
  it('renders copyright text with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} Skitbit. All rights reserved.`)).toBeInTheDocument()
  })

  it('renders privacy link', () => {
    render(<Footer />)
    const privacyLink = screen.getByRole('link', { name: /privacy/i })
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink).toHaveAttribute('href', '#privacy')
  })

  it('renders terms link', () => {
    render(<Footer />)
    const termsLink = screen.getByRole('link', { name: /terms/i })
    expect(termsLink).toBeInTheDocument()
    expect(termsLink).toHaveAttribute('href', '#terms')
  })

  it('renders footer with correct styling classes', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('border-t', 'border-neutral-900', 'bg-[#0a0a0a]')
  })

  it('renders links with hover effects', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-lime-300')
    })
  })
})
