import styled from 'styled-components'
import NavBar from './Navbar'
import { useRouter } from 'next/router'


function Layout ({children}) {
    const {route} = useRouter();

    return (
    <Container>
      <NavBar active={route}></NavBar>
      <Main>{children}</Main>
    </Container>
    )
};

export default Layout;

const Container = styled.div`
  background-color: var(--dark);
  min-height: 100vh;
`;

const Main = styled.main`
  margin-top: 3rem;
  display: grid;
  justify-items: center;
  align-items: center;
  padding: 0 2rem;
  @media (max-width: 768px) {
    & {
      padding: 0 1rem;
    }
  }
`;