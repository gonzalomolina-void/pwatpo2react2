import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TeamMember from './TeamMember';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key === 'about.studentId' ? 'Legajo' : key,
  }),
}));

describe('TeamMember Component', () => {
  const mockProps = {
    nombre: 'Juan Pérez',
    legajo: '12345',
    rol: 'DEVELOPER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
  };

  it('renders member information correctly', () => {
    render(<TeamMember {...mockProps} />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText(/Legajo: 12345/)).toBeInTheDocument();
    expect(screen.getByText('DEVELOPER')).toBeInTheDocument();
    
    const img = screen.getByAltText('Juan Pérez');
    expect(img).toHaveAttribute('src', mockProps.avatar);
  });
});
