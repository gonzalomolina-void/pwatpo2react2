import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AcercaDe from './AcercaDe';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock de subcomponentes
vi.mock('./Modal', ({ children, isOpen, onClose, title }) => ({
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
});
