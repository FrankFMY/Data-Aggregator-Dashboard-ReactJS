import { render, screen } from '@testing-library/react';
import { CurrencyList } from './CurrencyList';
import type { CurrencyRate } from './CurrencyList';

describe('CurrencyList', () => {
  const rates: CurrencyRate[] = [
    { code: 'USD', name: 'Доллар США', rate: 0.011 },
    { code: 'EUR', name: 'Евро', rate: 0.01 },
  ];

  it('корректно отображает список валют', () => {
    render(<CurrencyList rates={rates} />);
    expect(screen.getByText(/Доллар США/i)).toBeInTheDocument();
    expect(screen.getByText(/Евро/i)).toBeInTheDocument();
    expect(screen.getAllByText('0.01')).toHaveLength(2);
  });

  it('не рендерит ничего при пустом массиве', () => {
    const { container } = render(<CurrencyList rates={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
