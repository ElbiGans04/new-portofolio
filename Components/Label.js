import styled from 'styled-components'

const Label = styled.label`
    color: var(--pink);
    font-weight: bold;
    font-size: ${({fontSize}) => `${fontSize}` || '1.3rem'};
    @media (max-width: 768px) {
        & {
            font-size: ${({fontSize}) => `${fontSize}` || '1rem'}
        }
    }
`;

export default Label;