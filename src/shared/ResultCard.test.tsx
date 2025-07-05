import { render, screen, fireEvent } from '@testing-library/react';
import { ResultCard } from './ResultCard';
import type { ResultStatus } from './ResultCard';

describe('ResultCard', () => {
    const icon = <span data-testid='icon'>I</span>;
    const label = 'Пользователи';
    const onClick = jest.fn();

    it.each<ResultStatus>(['success', 'error', 'loading', 'aborted'])(
        'отображает статус %s',
        (status) => {
            render(
                <ResultCard
                    icon={icon}
                    label={label}
                    status={status}
                    onClick={onClick}
                />
            );
            expect(screen.getByText(label)).toBeInTheDocument();
            expect(screen.getByTestId('icon')).toBeInTheDocument();
            expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
            // Проверяем текст статуса
            if (status === 'success')
                expect(screen.getByText('Готово')).toBeInTheDocument();
            if (status === 'error')
                expect(screen.getByText('Ошибка')).toBeInTheDocument();
            if (status === 'loading')
                expect(screen.getByText('Загрузка')).toBeInTheDocument();
            if (status === 'aborted')
                expect(screen.getByText('Отменено')).toBeInTheDocument();
        }
    );

    it('вызывает onClick при клике', () => {
        render(
            <ResultCard
                icon={icon}
                label={label}
                status='success'
                onClick={onClick}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});
