import { render, screen } from '@testing-library/react';
import { Error as ErrorComponent } from './Error';

describe('ErrorComponent', () => {
  it('отображает строку ошибки', () => {
    render(<ErrorComponent error="Ошибка загрузки" />);
    expect(screen.getByText('Ошибка загрузки')).toBeInTheDocument();
  });

  it('отображает message объекта Error', () => {
    render(<ErrorComponent error={new Error('Ошибка API')} />);
    expect(screen.getByText('Ошибка API')).toBeInTheDocument();
  });

  it('не рендерит ничего при error=null', () => {
    const { container } = render(<ErrorComponent error={null} />);
    expect(container.firstChild).toBeNull();
  });
});
