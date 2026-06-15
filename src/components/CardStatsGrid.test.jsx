import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardStatsGrid from './CardStatsGrid';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  })
}));

describe('CardStatsGrid Component', () => {
  const typeOptions = [
    { id: 1, labelKey: 'card.types.creature' },
    { id: 2, labelKey: 'card.types.spell' }
  ];
  const rarityOptions = [
    { id: 1, labelKey: 'card.rarities.poor' },
    { id: 2, labelKey: 'card.rarities.common' }
  ];

  const mockSetCost = vi.fn();
  const mockSetAtk = vi.fn();
  const mockSetDef = vi.fn();
  const mockSetImage = vi.fn();
  const mockSetTypeId = vi.fn();
  const mockSetRarityId = vi.fn();

  it('debería renderizar todos los inputs y selectores con los valores correspondientes', () => {
    render(
      <CardStatsGrid
        cost="5" setCost={mockSetCost}
        atk="4" setAtk={mockSetAtk}
        def="3" setDef={mockSetDef}
        image="test.png" setImage={mockSetImage}
        typeId="1" setTypeId={mockSetTypeId}
        rarityId="2" setRarityId={mockSetRarityId}
        typeOptions={typeOptions}
        rarityOptions={rarityOptions}
      />
    );

    expect(screen.getByTestId('input-cost')).toHaveValue(5);
    expect(screen.getByTestId('input-atk')).toHaveValue(4);
    expect(screen.getByTestId('input-def')).toHaveValue(3);
    expect(screen.getByTestId('input-image')).toHaveValue('test.png');
    expect(screen.getByTestId('select-type')).toHaveValue('1');
    expect(screen.getByTestId('select-rarity')).toHaveValue('2');
  });

  it('debería disparar los setters correspondientes al cambiar los valores de los inputs', () => {
    render(
      <CardStatsGrid
        cost="5" setCost={mockSetCost}
        atk="4" setAtk={mockSetAtk}
        def="3" setDef={mockSetDef}
        image="test.png" setImage={mockSetImage}
        typeId="1" setTypeId={mockSetTypeId}
        rarityId="2" setRarityId={mockSetRarityId}
        typeOptions={typeOptions}
        rarityOptions={rarityOptions}
      />
    );

    fireEvent.change(screen.getByTestId('input-cost'), { target: { value: '8' } });
    expect(mockSetCost).toHaveBeenCalledWith('8');

    fireEvent.change(screen.getByTestId('input-atk'), { target: { value: '6' } });
    expect(mockSetAtk).toHaveBeenCalledWith('6');

    fireEvent.change(screen.getByTestId('input-def'), { target: { value: '7' } });
    expect(mockSetDef).toHaveBeenCalledWith('7');

    fireEvent.change(screen.getByTestId('input-image'), { target: { value: 'new.png' } });
    expect(mockSetImage).toHaveBeenCalledWith('new.png');

    fireEvent.change(screen.getByTestId('select-type'), { target: { value: '2' } });
    expect(mockSetTypeId).toHaveBeenCalledWith('2');

    fireEvent.change(screen.getByTestId('select-rarity'), { target: { value: '1' } });
    expect(mockSetRarityId).toHaveBeenCalledWith('1');
  });
});
