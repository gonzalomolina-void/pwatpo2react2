import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'nav.home': 'Inicio',
        'nav.favorites': 'Favoritos',
        'about.title': 'Acerca de'
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de subcomponentes para simplificar
vi.mock('./ThemeToggle', () => ({
  default: () => <button data-testid="theme-toggle">Theme</button>
}));
vi.mock('./LanguageSelector', () => ({
  default: () => <select data-testid="lang-selector"><option>ES</option></select>
}));

describe('Header Component', () => {
  it('renders navigation links and logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    // Tanto el Logo como el link del Nav se llaman "Inicio" (uno por aria-label y otro por texto)
    const homeLinks = screen.getAllByRole('link', { name: 'Inicio' });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    // Ahora debería verse el link de favoritos en el menú mobile
    expect(screen.getAllByText('Favoritos')).toHaveLength(2);
  });
});
