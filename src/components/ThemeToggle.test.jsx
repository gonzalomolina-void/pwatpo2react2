import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { preferencesService } from '../services/preferencesService';

// Mock de preferencesService
vi.mock('../services/preferencesService', () => ({
  preferencesService: {
    getTheme: vi.fn(),
    setTheme: vi.fn(),
  },
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('toggles theme when clicked', () => {
    preferencesService.getTheme.mockReturnValue('light');
    
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(preferencesService.setTheme).toHaveBeenCalledWith('dark');
  });

  it('initializes with theme from preferencesService', () => {
    preferencesService.getTheme.mockReturnValue('dark');
    
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
