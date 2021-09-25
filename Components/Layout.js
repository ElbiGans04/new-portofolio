import styled from 'styled-components'
import NavBar from './Navbar'
import Router , { useRouter } from 'next/router'
import ErrorBoundary from './ErrorBoundary'
import upperFirstWord from '../lib/module/upperFirstWord'
import Heading from './Heading'


function Layout ({children}) {
    const {route} = useRouter();
    const urlHeadingExplisite = ['/404'];
    const mustShowHeading = urlHeadingExplisite.find(url => route === url);
    const url = route.split('/');
    const pageActive = !mustShowHeading && upperFirstWord(url[url.length - 1]);

    return (
      <ErrorBoundary>
        <Container>
          <NavBar active={route}></NavBar>
          <Main>
            {pageActive && <Heading size={3} minSize={2}><span>{pageActive}</span></Heading>}
            {children}
          </Main>
        </Container>
      </ErrorBoundary>
    )
};

export default Layout;

const Container = styled.div`
  background-color: var(--dark);
  min-height: 100vh;
`;

const Main = styled.main`
  display: grid;
  justify-items: center;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  @media (max-width: 768px) {
    & {
      margin-top: 1rem;
      padding: 1rem;
    }
  }
`;