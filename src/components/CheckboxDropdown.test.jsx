import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckboxDropdown from './CheckboxDropdown';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('CheckboxDropdown Component', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];
  const mockOnChange = vi.fn();

  it('renders with label when nothing is selected', () => {
    render(<CheckboxDropdown label="Select" options={options} selected={[]} onChange={mockOnChange} />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<CheckboxDropdown label="Select" options={options} selected={[]} onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange with new values when clicking checkboxes', () => {
    render(<CheckboxDropdown label="Select" options={options} selected={[]} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button'));

    const checkbox1 = screen.getByLabelText('Option 1');
    fireEvent.click(checkbox1);

    expect(mockOnChange).toHaveBeenCalledWith(['1']);
  });

  it('calls onChange with empty array when clearing', () => {
    render(<CheckboxDropdown label="Select" options={options} selected={['1']} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button'));

    const clearButton = screen.getByText('search.clear');
    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <CheckboxDropdown label="Select" options={options} selected={[]} onChange={mockOnChange} />
      </div>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});
