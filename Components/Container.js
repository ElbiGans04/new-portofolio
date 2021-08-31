import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  width: 70%;
  gap: 1rem;

  @media (max-width: 768px) {
    & {
      width: 80%;
    }
  }

  @media (max-width: 576px) {
    & {
      width: 90%;
    }
  }
`;


export default Container