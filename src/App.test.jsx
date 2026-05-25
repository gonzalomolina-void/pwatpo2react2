import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { preferencesService } from './services/preferencesService';

// Mockear react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str) => str,
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

vi.mock('./services/preferencesService', () => ({
  preferencesService: {
    hasSeenSplashScreen: vi.fn(),
    setSplashScreenSeen: vi.fn(),
    getTheme: vi.fn(() => 'dark'),
    setTheme: vi.fn(),
    getLanguage: vi.fn(() => 'es'),
    setLanguage: vi.fn(),
  },
}));

vi.mock('./components/SplashScreen', () => ({
  default: ({ onComplete }) => (
    <div data-testid="splash-screen">
      <button onClick={onComplete} data-testid="complete-splash">Complete</button>
    </div>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza sin crashear', () => {
    vi.mocked(preferencesService.hasSeenSplashScreen).mockReturnValue(true);
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('muestra la splash screen si no ha sido vista', () => {
    vi.mocked(preferencesService.hasSeenSplashScreen).mockReturnValue(false);
    render(<App />);
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });

  it('oculta la splash screen cuando se completa', () => {
    vi.mocked(preferencesService.hasSeenSplashScreen).mockReturnValue(false);
    render(<App />);
    
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
    
    const button = screen.getByTestId('complete-splash');
    act(() => {
      button.click();
    });
    
    expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    expect(preferencesService.setSplashScreenSeen).toHaveBeenCalled();
  });

  it('no muestra la splash screen si ya fue vista', () => {
    vi.mocked(preferencesService.hasSeenSplashScreen).mockReturnValue(true);
    render(<App />);
    expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
  });
});
