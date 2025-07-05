import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
    it('не рендерится, если open=false', () => {
        render(
            <Modal
                open={false}
                onClose={jest.fn()}
            >
                Тест
            </Modal>
        );
        expect(screen.queryByText('Тест')).toBeNull();
    });

    it('отображает заголовок и содержимое, если open=true', () => {
        render(
            <Modal
                open={true}
                onClose={jest.fn()}
                title='Заголовок'
            >
                Контент
            </Modal>
        );
        expect(screen.getByText('Заголовок')).toBeInTheDocument();
        expect(screen.getByText('Контент')).toBeInTheDocument();
    });

    it('вызывает onClose при клике на ×', () => {
        const onClose = jest.fn();
        render(
            <Modal
                open={true}
                onClose={onClose}
            >
                Тест
            </Modal>
        );
        fireEvent.click(screen.getByLabelText(/закрыть/i));
        expect(onClose).toHaveBeenCalled();
    });
});
