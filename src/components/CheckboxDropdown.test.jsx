import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CheckboxDropdown from './CheckboxDropdown';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('CheckboxDropdown Component', () => {
  const options = [
    { label: 'Warrior', value: 'warrior' },
    { label: 'Mage', value: 'mage' },
    { label: 'Rogue', value: 'rogue' },
  ];
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = vi.fn();
  });

  // ✅ APERTURA/CIERRE TESTS
  describe('Dropdown Opening/Closing', () => {
    it('renders with label when nothing is selected', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );
      expect(screen.getByText('Select Type')).toBeInTheDocument();
    });

    it('opens dropdown when button is clicked', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(screen.getByText('Warrior')).toBeInTheDocument();
      expect(screen.getByText('Mage')).toBeInTheDocument();
      expect(screen.getByText('Rogue')).toBeInTheDocument();
    });

    it('closes dropdown when button is clicked again', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );
      const button = screen.getAllByRole('button')[0];

      fireEvent.click(button);
      expect(screen.getByText('Warrior')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByText('Warrior')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <div data-testid="outside">Outside Element</div>
          <CheckboxDropdown
            label="Select Type"
            options={options}
            selected={[]}
            onChange={mockOnChange}
          />
        </div>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByText('Warrior')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByText('Warrior')).not.toBeInTheDocument();
    });

    it('does NOT close dropdown when clicking inside it', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const warriorCheckbox = screen.getByRole('checkbox', { name: /Warrior/i });
      fireEvent.click(warriorCheckbox);

      // El dropdown debería permanecer abierto
      expect(screen.getByText('Mage')).toBeInTheDocument();
    });
  });

  // ✅ SELECCIÓN MÚLTIPLE TESTS
  describe('Multiple Selection', () => {
    it('selects single option when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const warriorCheckbox = screen.getByRole('checkbox', { name: /Warrior/i });
      await user.click(warriorCheckbox);

      expect(mockOnChange).toHaveBeenCalledWith(['warrior']);
    });

    it('selects multiple options', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const warriorCheckbox = screen.getByRole('checkbox', { name: /Warrior/i });
      const mageCheckbox = screen.getByRole('checkbox', { name: /Mage/i });

      await user.click(warriorCheckbox);

      expect(mockOnChange).toHaveBeenLastCalledWith(['warrior']);

      rerender(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior']}
          onChange={mockOnChange}
        />
      );

      await user.click(mageCheckbox);

      expect(mockOnChange).toHaveBeenLastCalledWith(['warrior', 'mage']);
    });

    it('deselects option when already selected checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior']}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const warriorCheckbox = screen.getByRole('checkbox', { name: /Warrior/i });
      expect(warriorCheckbox).toBeChecked();

      await user.click(warriorCheckbox);

      expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('toggles between selected and unselected states', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getAllByRole('button')[0];
      await user.click(button);

      const rogueCheckbox = screen.getByRole('checkbox', { name: /Rogue/i });
      await user.click(rogueCheckbox);

      rerender(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['rogue']}
          onChange={mockOnChange}
        />
      );

      const updatedRogueCheckbox = screen.getByRole('checkbox', { name: /Rogue/i });
      expect(updatedRogueCheckbox).toBeChecked();

      await user.click(updatedRogueCheckbox);
      expect(mockOnChange).toHaveBeenLastCalledWith([]);
    });
  });

  // ✅ DISPLAY TEXT TESTS
  describe('Display Text', () => {
    it('shows label when no options are selected', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Select Type')).toBeInTheDocument();
    });

    it('shows selected option label when one selected', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior']}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Warrior')).toBeInTheDocument();
    });

    it('shows multiple labels when two items selected', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior', 'mage']}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Warrior, Mage')).toBeInTheDocument();
    });

    it('shows count text when more than two items selected', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior', 'mage', 'rogue']}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('3 search.selected')).toBeInTheDocument();
    });
  });

  // ✅ CLEAR BUTTON TESTS
  describe('Clear Button', () => {
    it('shows clear button only when selections exist', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.queryByText('search.clear')).not.toBeInTheDocument();
    });

    it('shows clear button when dropdown opened with selections', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior']}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('search.clear')).toBeInTheDocument();
    });

    it('clears all selections when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior', 'mage']}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const clearButton = screen.getByText('search.clear');
      await user.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });

  // ✅ PARENT COMMUNICATION TESTS
  describe('Parent Communication', () => {
    it('communicates with parent through onChange callback', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getAllByRole('button')[0];
      await user.click(button);

      const mageCheckbox = screen.getByRole('checkbox', { name: /Mage/i });
      await user.click(mageCheckbox);

      expect(mockOnChange).toHaveBeenCalledWith(['mage']);

      // Simular que el padre actualizó el estado
      rerender(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['mage']}
          onChange={mockOnChange}
        />
      );

      // Use getByRole para checkbox en lugar de getByText para evitar ambigüedad
      expect(screen.getByRole('checkbox', { name: /Mage/i })).toBeChecked();
    });

    it('updates selected state when parent updates prop', () => {
      const { rerender } = render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getAllByRole('button')[0];
      fireEvent.click(button);
      const warriorCheckbox = screen.getByRole('checkbox', { name: /Warrior/i });
      expect(warriorCheckbox).not.toBeChecked();

      rerender(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['warrior']}
          onChange={mockOnChange}
        />
      );

      expect(warriorCheckbox).toBeChecked();
    });
  });

  // ✅ EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={[]}
          selected={[]}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // No debe haber checkboxes
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('handles selected values not in options', () => {
      render(
        <CheckboxDropdown
          label="Select Type"
          options={options}
          selected={['nonexistent']}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // No debe renderizar un label para el valor inexistente
      expect(screen.getByText('search.clear')).toBeInTheDocument();
    });
  });
});
