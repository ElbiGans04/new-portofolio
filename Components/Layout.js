import styled from 'styled-components'
import NavBar from './Navbar'


function Layout ({children}) {
    return (
    <Container>
      <NavBar></NavBar>
      <Main>{children}</Main>
    </Container>
    )
};

export default Layout;

const Container = styled.div`
  background-color: var(--dark);
  height: 100vh;
`;

const Main = styled.main`
  margin-top: 3rem;
  display: grid;
  justify-items: center;
  align-items: center;

  @media (max-width: 768px) {
    & {
      padding: 0 1rem;
    }
  }
`;