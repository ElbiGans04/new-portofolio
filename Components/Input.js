import styled from 'styled-components'
const Input = styled.input`
    appearance: none;
    box-sizing: border-box;
    padding: .5rem;
    border-radius: .5rem;
    margin: .5rem;
    &:focus {
        border: 3px solid var(--pink);
        outline: none;
    }

    &[type=radio] {
        border: 1px solid var(--pink)
    }
    
    &[type=radio]:checked{
        background-color: var(--pink)
    }

    @media (max-width: 576px) {
        & {
            padding: .3rem;
            border-radius: .3rem;
        }
    }
`;

export default Input