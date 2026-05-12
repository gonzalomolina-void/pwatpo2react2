import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BackButton from './BackButton';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key === 'backButton.defaultLabel' ? 'Volver' : key,
  }),
}));

describe('BackButton Component', () => {
  it('renders with default label', () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(
      <MemoryRouter>
        <BackButton label="Ir a Inicio" />
      </MemoryRouter>
    );
    expect(screen.getByText('Ir a Inicio')).toBeInTheDocument();
  });

  it('has the correct link destination', () => {
    render(
      <MemoryRouter>
        <BackButton to="/favoritos" />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/favoritos');
  });
});
