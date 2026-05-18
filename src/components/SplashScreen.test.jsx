import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SplashScreen from './SplashScreen';

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

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renderiza el título HEXA y el concepto aleatorio', () => {
    render(<SplashScreen onComplete={() => {}} />);
    expect(screen.getByText('HEXA')).toBeInTheDocument();
    expect(screen.getByText('El Portal del Nexo...')).toBeInTheDocument();
  });

  it('se muestra con opacidad completa inicialmente', () => {
    const { container } = render(<SplashScreen onComplete={() => {}} />);
    expect(container.firstChild.className).toContain('opacity-100');
    expect(container.firstChild.className).not.toContain('opacity-0');
  });

  it('inicia la transición de salida 2500ms después de cargar la imagen', () => {
    const { container } = render(<SplashScreen onComplete={() => {}} />);
    const img = screen.getByRole('img');
    act(() => { fireEvent.load(img); });

    act(() => { vi.advanceTimersByTime(2500); });

    expect(container.firstChild.className).toContain('opacity-0');
  });

  it('llama a onComplete después de 3300ms (2500ms + 800ms de salida)', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);

    const img = screen.getByRole('img');
    act(() => { fireEvent.load(img); });

    act(() => { vi.advanceTimersByTime(2500 + 800); });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('no llama a onComplete si la imagen nunca cargó', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);

    vi.advanceTimersByTime(5000);

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('en caso de error en la imagen, setea imageLoaded y continúa el flujo', () => {
    const onComplete = vi.fn();
    const { container } = render(<SplashScreen onComplete={onComplete} />);
    const img = screen.getByRole('img');

    act(() => { fireEvent.error(img); });

    expect(container.firstChild.className).toContain('opacity-100');

    act(() => { vi.advanceTimersByTime(2500 + 800); });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
