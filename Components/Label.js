import styled from 'styled-components'

const Label = styled.label`
    color: var(--pink);
    font-weight: bold;
    font-size: 1.3rem;
    @media (max-width: 576px) {
        & {
            font-size: 1rem;
        }
    }
`;

export default Label;