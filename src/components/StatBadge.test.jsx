import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatBadge from './StatBadge';

describe('StatBadge Component', () => {
  it('renders correctly with given value and icon', () => {
    render(<StatBadge icon="⚔️" value="10" color="text-red-500" />);
    
    expect(screen.getByText('⚔️')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('applies the correct color class', () => {
    const { container } = render(<StatBadge icon="🛡️" value="5" color="text-blue-500" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('text-blue-500');
  });

  it('applies large size styles when size is "lg"', () => {
    const { container } = render(<StatBadge icon="✨" value="20" color="text-yellow-500" size="lg" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('text-2xl');
  });

  it('applies small size styles by default', () => {
    const { container } = render(<StatBadge icon="✨" value="20" color="text-yellow-500" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('text-sm');
  });
});
