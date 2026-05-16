import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

const mockT = vi.hoisted(() => (str) => str);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'es'
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe('NotFound Page', () => {
  it('renderiza el título 404', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('notFound.title')).toBeInTheDocument();
  });

  it('renderiza el heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('notFound.heading')).toBeInTheDocument();
  });

  it('renderiza la descripción', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('notFound.description')).toBeInTheDocument();
  });

  it('renderiza el botón de retorno a Home con label correcto', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    const link = screen.getByText('notFound.backToCatalog');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});
