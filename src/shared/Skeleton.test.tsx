import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
    it('рендерится без ошибок с width и height', () => {
        const { container } = render(
            <Skeleton
                width='50px'
                height='10px'
            />
        );
        const div = container.firstChild as HTMLDivElement;
        expect(div).toBeInTheDocument();
        expect(div.style.width).toBe('50px');
        expect(div.style.height).toBe('10px');
    });
});
