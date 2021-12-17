import styled from 'styled-components'
import resize from '@module/resize'
const Label = styled.label<{size: number, minSize: number}>`
    color: var(--pink);
    font-weight: bold;
    font-size: ${({size}) => `${size}rem` || '1.5rem'};
    @media (max-width: 768px) {
        & {
            font-size: ${({size, minSize}) => resize(size, 0.5, minSize)};
        }
    }

    @media (max-width: 576px) {
        & {
            font-size: ${({size, minSize}) => resize(size, 1, minSize)};
        }
    }
`;

export default Label;