import styled from 'styled-components'
const Input = styled.input`
    appearance: none;
    box-sizing: border-box;
    padding: .5rem;
    border-radius: .5rem;
    &:focus {
        border: 3px solid var(--pink);
        outline: none;
    }

    @media (max-width: 576px) {
        & {
            padding: .3rem;
            border-radius: .3rem;
            width: 50%;
        }
    }
`;

export default Input