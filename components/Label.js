import styled from 'styled-components'
import resize from '../lib/module/resize'
const Label = styled.label`
    color: var(--pink);
    font-weight: bold;
    font-size: ${({size}) => `${size}rem` || '1.5rem'};
    @media (max-width: 768px) {
        & {
            font-size: ${({size, minSize = 0}) => resize(size, 0.5, minSize)};
        }
    }

    @media (max-width: 576px) {
        & {
            font-size: ${({size, minSize = 0}) => resize(size, 1, minSize)};
        }
    }
`;

export default Label;