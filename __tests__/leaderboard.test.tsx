import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Leaderboard from '../components/leaderboard'
import { AuthProvider } from '../contexts/AuthContext'

// Mock the AuthContext
const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com'
}

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock fetch
global.fetch = jest.fn()

describe('Leaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        entries: [
          {
            userId: 'user-1',
            userName: 'John Doe',
            rank: 1,
            score: 1500,
            level: 5,
            change: 50
          },
          {
            userId: 'user-2',
            userName: 'Jane Smith',
            rank: 2,
            score: 1200,
            level: 4,
            change: -10
          }
        ]
      })
    })
  })

  it('renders loading state initially', () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    expect(screen.getAllByRole('generic', { hidden: true }).some(el =>
      el.classList.contains('animate-pulse')
    )).toBeTruthy()
  })

  it('renders leaderboard entries after loading', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    expect(screen.getByText('1,500 XP')).toBeInTheDocument()
    expect(screen.getByText('1,200 XP')).toBeInTheDocument()
  })

  it('displays user rank badge when user is not in top 10', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        entries: Array.from({ length: 15 }, (_, i) => ({
          userId: i === 14 ? 'user-1' : `user-${i + 2}`,
          userName: i === 14 ? 'John Doe' : `User ${i + 2}`,
          rank: i + 1,
          score: 1000 - i * 50,
          level: 3,
          change: 0
        }))
      })
    })

    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Your Rank')).toBeInTheDocument()
      expect(screen.getByText('#15')).toBeInTheDocument()
    })
  })

  it.skip('highlights current user entry', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Check that the user's entry is highlighted
    const userEntry = screen.getByText('John Doe').closest('div')
    expect(userEntry).toHaveClass('bg-primary/10')
  })

  it('displays correct rank icons', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Crown icon for rank 1 (yellow)
    const crownIcon = document.querySelector('.text-yellow-500')
    expect(crownIcon).toBeInTheDocument()

    // Medal icon for rank 2 (gray)
    const medalIcon = document.querySelector('.text-gray-400')
    expect(medalIcon).toBeInTheDocument()
  })

  it('formats values correctly for different types', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('1,500 XP')).toBeInTheDocument()
    })
  })

  it('changes period when select is changed', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const periodSelect = screen.getAllByRole('combobox')[0] // First combobox is period
    fireEvent.click(periodSelect)

    const monthlyOption = screen.getByRole('option', { name: /monthly/i })
    fireEvent.click(monthlyOption)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('period=monthly')
      )
    })
  })

  it('changes type when select is changed', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const typeSelect = screen.getAllByRole('combobox')[1] // Second combobox is type
    fireEvent.click(typeSelect)

    const streakOption = screen.getByRole('option', { name: /learning streak/i })
    fireEvent.click(streakOption)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('type=learning_streak')
      )
    })
  })

  it('refreshes leaderboard when button is clicked', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const refreshButton = screen.getByRole('button', { name: /refresh leaderboard/i })
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2) // Initial + 1 refresh
    })
  })

  it('displays empty state when no entries', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ entries: [] })
    })

    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('No entries yet')).toBeInTheDocument()
      expect(screen.getByText('Be the first to earn points!')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    })

    // Should still render the component even with API error
    expect(screen.getByRole('button', { name: /refresh leaderboard/i })).toBeInTheDocument()
  })

  it('displays change indicators correctly', async () => {
    render(
      <AuthProvider>
        <Leaderboard />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('+50')).toBeInTheDocument()
      expect(screen.getByText('-10')).toBeInTheDocument()
    })

    // Check for green color for positive change
    const positiveChange = screen.getByText('+50').closest('div')
    expect(positiveChange).toHaveClass('text-green-600')

    // Check for red color for negative change
    const negativeChange = screen.getByText('-10').closest('div')
    expect(negativeChange).toHaveClass('text-red-600')
  })
})
