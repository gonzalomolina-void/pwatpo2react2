import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/Invocando criaturas.../i)).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Cargando cartas..." />);
    expect(screen.getByText(/Cargando cartas.../i)).toBeInTheDocument();
  });

  it('contains the loading bar element', () => {
    const { container } = render(<LoadingSpinner />);
    // Buscamos la barra que tiene la clase de animación
    const loadingBar = container.querySelector('.animate-\\[loading-bar_2s_infinite\\]');
    expect(loadingBar).toBeInTheDocument();
  });
});
