import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'footer.copyright': 'Todos los derechos reservados',
        'footer.description': 'Creado con amor'
      };
      return translations[key] || key;
    },
  }),
}));

describe('Footer Component', () => {
  it('renders copyright and description', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
    expect(screen.getByText(/Creado con amor/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeInTheDocument();
  });
});
