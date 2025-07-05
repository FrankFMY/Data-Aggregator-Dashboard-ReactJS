import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
    it('рендерится без ошибок и содержит заголовок', () => {
        render(<Dashboard />);
        expect(
            screen.getByText(/Data Aggregator Dashboard/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Выберите источники данных/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Загрузить всё/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Отменить/i })
        ).toBeInTheDocument();
    });
});
