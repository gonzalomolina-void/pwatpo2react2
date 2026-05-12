import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mockear react-i18next para que no de errores de contexto en los tests
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        language: 'es'
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe('App Component', () => {
  it('renderiza sin crashear', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
