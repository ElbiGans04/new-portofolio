import useUser from "../lib/hooks/useUser";
import Head from 'next/head'
import styled from 'styled-components'
import {IoTrashBinOutline, IoAddOutline, IoPencilSharp}from 'react-icons/io5'

function Admin () {
    const {user} = useUser({redirectTo: '/login'});

    if (!user || user.isLoggedIn === false) {
      return <div>loading...</div>
    }
  
    return (
      <Container>
        <Head>
          <title>Admin Page</title>
        </Head>
        <ContainerButtons>
          <Button>
            <IoAddOutline />
            Add Project
          </Button>
        </ContainerButtons>
        <Table>
          <Thead>
            <TableRow>
              <Th></Th>
              <Th>Name</Th>
              <Th>Type Project</Th>
              <Th>Actions</Th>
            </TableRow>
          </Thead>
          <Tbody>

            <TableRow>
              <Td>
                <Button title="see details of project"><IoAddOutline /></Button>
              </Td>
              <Td>Elbi library</Td>
              <Td>Work Project</Td>
              <TdActions>
                <Button title="delete the project"><IoTrashBinOutline></IoTrashBinOutline></Button>
                <Button title="update the project"><IoPencilSharp></IoPencilSharp></Button>
              </TdActions>
         
            </TableRow>
            

          </Tbody>
        </Table>
      </Container>
    )
}

export default Admin

const Container = styled.div`
  width: 80%;
  min-height: 50vh;
  display: grid;
  grid-template-rows: 1fr 3fr;
  gap: 1rem;

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }

  @media (max-width: 576px) {
    & {
      overflow: auto;
    }
  }
`;

const ContainerButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: .5rem;
`;
const Table = styled.table`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 1rem;
  background-color: var(--dark2);
  padding: 1rem;
  border-radius: .8rem;
`;

const Thead = styled.thead`
  width: 100%;
  padding: .8rem;
  border-bottom: 2px solid var(--pink);
  display: grid;
  justify-items: center;
  align-items: center;
`;

const Tbody = styled.tbody`
  width: 100%;
  display: grid;
  gap: 1rem;
`;

const TableRow = styled.tr`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr repeat(2, 2fr) 1fr;
`

const Th = styled.th`
  color: var(--pink);
  font-size: 1.5rem;
  font-weight: bold;
  padding: .3rem;

  @media (max-width: 576px) {
    & {
      font-size: 1rem;
    }
  }
`;

const Td = styled.td`
  text-align: center;
  color: white;
  padding: .8rem;
`;

const TdActions = styled(Td)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
    appearance: none;
    padding: .3rem;
    margin: 0 .3rem;
    border-radius: .3rem;
    // background: var(--dark);
    // border: 3px solid var(--pink);
    // color: white;
    border: none;
    background-color: var(--pink);
    color: var(--dark);
    font-weight: bold;
    cursor: pointer;
`;