import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AcercaDe from './AcercaDe';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock de subcomponentes
vi.mock('./Modal', () => ({
  default: ({ children, isOpen, onClose, title }) => (
    isOpen ? (
      <div data-testid="modal">
        <h1>{title}</h1>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
  )
}));

vi.mock('./TeamMember', () => ({
  default: ({ nombre }) => <div data-testid="team-member">{nombre}</div>
}));

// Mock de assets
vi.mock('../assets/Bart.webp', () => ({ default: 'bart.webp' }));
vi.mock('../assets/Vegeta.webp', () => ({ default: 'vegeta.webp' }));
vi.mock('../assets/Grommash.webp', () => ({ default: 'grommash.webp' }));

describe('AcercaDe Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens modal when button is clicked', () => {
    render(<AcercaDe />);
    
    const openButton = screen.getByRole('button', { name: /about.title/i });
    fireEvent.click(openButton);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('about.title')).toBeInTheDocument();
  });

  it('renders all team members inside the modal', () => {
    render(<AcercaDe />);
    
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    
    const members = screen.getAllByTestId('team-member');
    expect(members).toHaveLength(3);
    expect(screen.getByText('Lautaro Mellado')).toBeInTheDocument();
    expect(screen.getByText('Gonzalo Molina')).toBeInTheDocument();
    expect(screen.getByText('Juan Cruz Espinoza')).toBeInTheDocument();
  });

  it('toggles easter egg quote on double click with ctrl key', () => {
    render(<AcercaDe />);
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    
    const cite = screen.getByText(/about.quoteAuthor/i);
    
    // Test initial quote
    expect(screen.getByText(/"about.quote"/i)).toBeInTheDocument();
    
    // Double click with ctrl key
    fireEvent.doubleClick(cite, { ctrlKey: true });
    expect(screen.getByText(/"about.easterEggQuote"/i)).toBeInTheDocument();
    expect(screen.getByText(/about.easterEggAuthor/i)).toBeInTheDocument();
    
    // Double click again to toggle back
    fireEvent.doubleClick(cite, { ctrlKey: true });
    expect(screen.getByText(/"about.quote"/i)).toBeInTheDocument();
  });

  it('does NOT toggle easter egg quote on double click without ctrl key', () => {
    render(<AcercaDe />);
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    
    const cite = screen.getByText(/about.quoteAuthor/i);
    
    fireEvent.doubleClick(cite, { ctrlKey: false });
    expect(screen.getByText(/"about.quote"/i)).toBeInTheDocument();
  });

  it('toggles easter egg quote on long press (touch)', () => {
    vi.useFakeTimers();
    // Mock vibrate if it doesn't exist in JSDOM
    if (!window.navigator.vibrate) {
      window.navigator.vibrate = vi.fn();
    }
    
    render(<AcercaDe />);
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    
    const cite = screen.getByText(/about.quoteAuthor/i);
    
    // Start touch
    fireEvent.touchStart(cite);
    
    // Advance time by 800ms
    act(() => {
      vi.advanceTimersByTime(800);
    });
    
    expect(screen.getByText(/"about.easterEggQuote"/i)).toBeInTheDocument();
    
    // End touch
    fireEvent.touchEnd(cite);
    
    vi.useRealTimers();
  });

  it('cancels long press if touch ends early', () => {
    vi.useFakeTimers();
    render(<AcercaDe />);
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    
    const cite = screen.getByText(/about.quoteAuthor/i);
    
    fireEvent.touchStart(cite);
    
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    fireEvent.touchEnd(cite);
    
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    expect(screen.getByText(/"about.quote"/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('resets easter egg when modal is closed', () => {
    render(<AcercaDe />);
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    
    const cite = screen.getByText(/about.quoteAuthor/i);
    fireEvent.doubleClick(cite, { ctrlKey: true });
    expect(screen.getByText(/"about.easterEggQuote"/i)).toBeInTheDocument();
    
    // Close modal (via the mock close button)
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    
    // Open again
    fireEvent.click(screen.getByRole('button', { name: /about.title/i }));
    expect(screen.getByText(/"about.quote"/i)).toBeInTheDocument();
  });
});
