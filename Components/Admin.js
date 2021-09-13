import styled from "styled-components";
import {
    IoAddOutline,
  } from "react-icons/io5";
import Button from './Button'
import Table from './Table'
export default function Admin({url = ''} = {}) {
  return (
    <Container>
      <ContainerButtons>
        <Button >
          <IoAddOutline />
          Add Entity
        </Button>
      </ContainerButtons>
      <Table url={url} />
    </Container>
  );
}

// Styled Component

const Container = styled.div`
  width: 80%;
  min-height: 50vh;
  overflow: hidden;

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;

const ContainerButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
`;
