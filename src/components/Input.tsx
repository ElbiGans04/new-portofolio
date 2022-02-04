import styled from 'styled-components';

const Input = styled.input`
  appearance: none;
  background-color: transparent;
  box-sizing: border-box;
  border: none;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  border-bottom: 2px solid rgba(255, 167, 196, 0.3);
  box-sizing: border-box;
  color: var(--text);
  outline: none;
  padding: 0.5rem;
  transition: var(--transition);

  &:focus,
  &:hover {
    border-bottom: 2px solid var(--pink);
  }

  &[type='radio'] {
    border: 1px solid var(--pink);
    border-radius: 50%;
    margin: 0 0.3rem;
  }

  &[type='radio']:checked {
    background-color: var(--pink);
  }
`;

export default Input;
