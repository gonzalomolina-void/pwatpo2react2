import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('SearchBar Component', () => {
  const mockOnSearch = vi.fn();
  const typeOptions = [{ label: 'Unit', value: 'unit' }];
  const rarityOptions = [{ label: 'Rare', value: 'rare' }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input with placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
  });

  it('calls onSearch with debounce when typing', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={10} />);
    const input = screen.getByPlaceholderText('search.placeholder');

    fireEvent.change(input, { target: { value: 'Dragon' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({
        searchTerm: 'Dragon'
      }));
    }, { timeout: 100 });
  });

  it('clears search term when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('search.placeholder');

    fireEvent.change(input, { target: { value: 'Dragon' } });
    
    const clearButton = screen.getByLabelText('search.clear');
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({
      searchTerm: ''
    }));
  });

  it('renders dropdowns if options are provided', () => {
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
