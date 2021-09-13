import styled, {keyframes} from 'styled-components'
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
          <ProgressBar></ProgressBar>
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

const animation = keyframes`
  from {
    width: 0px;
  }

  to {
    width: 100%;
  }
`;
const animation2 = keyframes`
  from {
    width: 0px;
  }

  to {
    width: 80%;
  }
`;
const ProgressBar = styled.div`
  position: fixed;
  width: 0%;
  height: 10px;
  background-color: var(--pink);
  z-index: 9999;
  animation-name: ${animation2};
  animation-duration: 5s;
  animation-iteration-count: 1;
`;

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