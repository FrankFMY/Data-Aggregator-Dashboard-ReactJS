import { render } from '@testing-library/react';
import CurrencyPage from './CurrencyPage';

describe('CurrencyPage', () => {
    it('рендерится без ошибок', () => {
        render(<CurrencyPage />);
    });
});
