import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import SearchBar from './SearchBar';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('SearchBar Component', () => {
  const mockOnSearch = vi.fn();
  const typeOptions = [
    { label: 'Unit', value: 'unit' },
    { label: 'Spell', value: 'spell' },
  ];
  const rarityOptions = [
    { label: 'Rare', value: 'rare' },
    { label: 'Epic', value: 'epic' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // ✅ VALIDAR INPUT TESTS
  describe('Input Validation', () => {
    it('renders input with placeholder', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
    });

    it('updates input value when user types', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Dragon' } });

      expect(input.value).toBe('Dragon');
    });

    it('starts with empty input', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      expect(input.value).toBe('');
    });

    it('accepts numeric and special characters', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Test-123!' } });

      expect(input.value).toBe('Test-123!');
    });
  });

  // ✅ DEBOUNCE TESTS
  describe('Debounce Behavior', () => {
    it('does NOT call onSearch immediately when typing', () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'D' } });

      // No debe llamarse inmediatamente
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('calls onSearch after debounce time when typing stops', () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Dragon' } });

      expect(mockOnSearch).not.toHaveBeenCalled();

      // Simular paso del tiempo de debounce
      vi.advanceTimersByTime(300);

      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: 'Dragon',
          selectedTypes: [],
          selectedRarities: [],
        })
      );
    });

    it('restarts debounce timer when user continues typing', () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'D' } });
      vi.advanceTimersByTime(200); // Esperar menos que debounceMs
      expect(mockOnSearch).not.toHaveBeenCalled();

      fireEvent.change(input, { target: { value: 'Dr' } });
      vi.advanceTimersByTime(200); // Esperar otros 200ms
      expect(mockOnSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100); // Completar el nuevo debounce
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('respects custom debounceMs prop', () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={500} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Test' } });

      vi.advanceTimersByTime(300); // Menos que 500ms
      expect(mockOnSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200); // Completar 500ms
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('sends complete state with debounced search', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          typeOptions={typeOptions}
          rarityOptions={rarityOptions}
          debounceMs={300}
        />
      );
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Fire' } });

      vi.advanceTimersByTime(300);

      expect(mockOnSearch).toHaveBeenCalledWith({
        searchTerm: 'Fire',
        selectedTypes: [],
        selectedRarities: [],
      });
    });
  });

  // ✅ LIMPIAR BÚSQUEDA TESTS
  describe('Clear Search Functionality', () => {
    it('shows clear button only when input has text', () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      // No debe existir botón clear sin texto
      expect(screen.queryByLabelText('search.clear')).not.toBeInTheDocument();

      const input = screen.getByPlaceholderText('search.placeholder');
      fireEvent.change(input, { target: { value: 'Dragon' } });

      // Debe existir botón clear con texto
      expect(screen.getByLabelText('search.clear')).toBeInTheDocument();
    });

    it('hides clear button after clearing', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Dragon' } });
      expect(screen.getByLabelText('search.clear')).toBeInTheDocument();

      const clearButton = screen.getByLabelText('search.clear');
      fireEvent.click(clearButton);

      expect(screen.queryByLabelText('search.clear')).not.toBeInTheDocument();
    });

    it('clears search term when clear button is clicked', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Dragon' } });
      const clearButton = screen.getByLabelText('search.clear');
      fireEvent.click(clearButton);

      expect(input.value).toBe('');
    });

    it('calls onSearch with empty term when clear button is clicked', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Dragon' } });
      vi.advanceTimersByTime(300);
      mockOnSearch.mockClear();

      const clearButton = screen.getByLabelText('search.clear');
      fireEvent.click(clearButton);

      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: '' })
      );
    });

    it('cancels pending debounce when clear is clicked', () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
      const input = screen.getByPlaceholderText('search.placeholder');

      fireEvent.change(input, { target: { value: 'Dragon' } });
      // No esperar el debounce, clickear clear inmediatamente
      const clearButton = screen.getByLabelText('search.clear');
      fireEvent.click(clearButton);

      // Avanzar el tiempo que habría esperado el debounce
      vi.advanceTimersByTime(300);

      // Solo se debe llamar una vez (del botón clear)
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: '' })
      );
    });
  });

  // ✅ DROPDOWN TESTS
  describe('Dropdown Rendering', () => {
    it('renders type dropdown when typeOptions provided', () => {
      render(
        <SearchBar onSearch={mockOnSearch} typeOptions={typeOptions} />
      );

      expect(screen.getByText('search.types')).toBeInTheDocument();
    });

    it('renders rarity dropdown when rarityOptions provided', () => {
      render(
        <SearchBar onSearch={mockOnSearch} rarityOptions={rarityOptions} />
      );

      expect(screen.getByText('search.rarities')).toBeInTheDocument();
    });

    it('does NOT render type dropdown when typeOptions is empty', () => {
      render(
        <SearchBar onSearch={mockOnSearch} typeOptions={[]} />
      );

      expect(screen.queryByText('search.types')).not.toBeInTheDocument();
    });

    it('renders both dropdowns when both options provided', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          typeOptions={typeOptions}
          rarityOptions={rarityOptions}
        />
      );

      expect(screen.getByText('search.types')).toBeInTheDocument();
      expect(screen.getByText('search.rarities')).toBeInTheDocument();
    });
  });

  // ✅ CLEANUP TESTS
  describe('Cleanup & Unmount', () => {
    it('cleans up debounce timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

      const { unmount } = render(
        <SearchBar onSearch={mockOnSearch} debounceMs={300} />
      );

      const input = screen.getByPlaceholderText('search.placeholder');
      fireEvent.change(input, { target: { value: 'test' } });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });


    it('does not call onSearch after unmount', () => {
      const { unmount } = render(
        <SearchBar onSearch={mockOnSearch} debounceMs={300} />
      );

      const input = screen.getByPlaceholderText('search.placeholder');
      fireEvent.change(input, { target: { value: 'Dragon' } });

      unmount();
      mockOnSearch.mockClear();

      // Avanzar el tiempo del debounce después de desmontar
      vi.advanceTimersByTime(300);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  // ✅ TEST DE SINCRONIZACIÓN REACTIVA DE PROPS
  describe('Reactive Props Sync', () => {
    it('sincroniza el input local de búsqueda al cambiar la prop filters', () => {
      const { rerender } = render(
        <SearchBar onSearch={mockOnSearch} filters={{ searchTerm: '', selectedTypes: [], selectedRarities: [] }} />
      );
      const input = screen.getByPlaceholderText('search.placeholder');
      expect(input.value).toBe('');

      // Cambiamos la prop de filtros
      rerender(
        <SearchBar onSearch={mockOnSearch} filters={{ searchTerm: 'Dragon', selectedTypes: [], selectedRarities: [] }} />
      );
      expect(input.value).toBe('Dragon');
    });

    it('NO invoca el callback onSearch al actualizarse mediante la prop filters', () => {
      const { rerender } = render(
        <SearchBar onSearch={mockOnSearch} filters={{ searchTerm: '', selectedTypes: [], selectedRarities: [] }} />
      );
      mockOnSearch.mockClear();

      // Rerender con nuevos filtros
      rerender(
        <SearchBar onSearch={mockOnSearch} filters={{ searchTerm: 'Spellcaster', selectedTypes: [], selectedRarities: [] }} />
      );

      vi.advanceTimersByTime(500); // Avanzamos cualquier posible timer
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });
});
