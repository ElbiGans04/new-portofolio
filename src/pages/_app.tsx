import '../styles/reset.css';
import '../styles/globals.css';
import styled, { createGlobalStyle } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import upperFirstWord from '@module/upperFirstWord';
import Heading from '@components/Heading';
import ErrorComponent from '@components/Error';
import React, { useState, ErrorInfo, ReactNode } from 'react';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

function Layout({ children }: { children: ReactNode }) {
  const { route } = useRouter();
  const urlHeadingExplisite = ['/404'];
  const mustShowHeading = urlHeadingExplisite.find((url) => route === url);
  const url = route.split('/');
  const pageActive = !mustShowHeading && upperFirstWord(url[url.length - 1]);

  return (
    <ErrorBoundary>
      <Container>
        <NavBar active={route} />
        <Main>
          {pageActive && (
            <Heading size={3} minSize={2}>
              <span>{pageActive}</span>
            </Heading>
          )}
          {children}
        </Main>
      </Container>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorContainer>
          <ErrorComponent
            src="/images/problem.svg"
            solution="Please refresh the page"
            message="There is an error in the page :("
          />
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const urlComponents = [
  { name: 'About', url: '/about' },
  { name: 'Contacts', url: '/contacts' },
  { name: 'Projects', url: '/projects' },
  { name: 'Tools', url: '/tools' },
];

function NavBar({ active }: { active: string }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <Navbar>
      {navbarOpen && <GlobalStyle />}
      <NavbarHead>
        <Link passHref href="/">
          <NavbarHeadItem>Elbi</NavbarHeadItem>
        </Link>
      </NavbarHead>

      <NavbarButton>
        <NavbarButtonInput
          checked={navbarOpen}
          onChange={() => setNavbarOpen((state) => !state)}
          type="checkbox"
        />
        <NavbarButtonSpan />
        <NavbarButtonSpan />
        <NavbarButtonSpan />
      </NavbarButton>

      <NavbarMain style={navbarOpen ? { top: 0 } : {}}>
        {urlComponents.map((value, index) => (
          <Link href={value.url} passHref key={index}>
            {value.url === active ? (
              <ItemsActive onClick={() => setNavbarOpen(false)}>
                {value.name}
              </ItemsActive>
            ) : (
              <Items onClick={() => setNavbarOpen(false)}>{value.name}</Items>
            )}
          </Link>
        ))}
      </NavbarMain>
    </Navbar>
  );
}

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

// Styled Component Error
const ErrorContainer = styled.div`
  height: 100vh;
  background-color: var(--dark);
  display: grid;
  justify-items: center;
  align-items: center;
`;

// End of styled component error

// Navbar styled component

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden!important;
  }
`;
const Navbar = styled.nav`
  z-index: 2;
  width: 100%;
  padding: 2rem 3rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-items: center;
  align-items: center;
  position: relative;

  @media (min-width: 768px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const Items = styled.a`
  text-decoration: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
`;

const NavbarHead = styled.div`
  justify-self: start;
`;

const NavbarHeadItem = styled(Items)`
  color: var(--pink);
  font-size: 2rem;
`;

const NavbarButton = styled.div`
  justify-self: end;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  z-index: 3;
  position: relative;
  width: 40px;
  height: 100%;

  & input:checked ~ span:nth-child(2) {
    transform: rotate(45deg) translateY(10px) translateX(15px);
  }

  & input:checked ~ span:nth-child(3) {
    opacity: 0;
  }

  & input:checked ~ span:nth-child(4) {
    transform: rotate(-45deg) translateY(-6px) translateX(10px);
  }

  @media (max-width: 768px) {
    & {
      display: flex;
    }
  }
`;

const NavbarButtonInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const NavbarButtonSpan = styled.span`
  width: 100%;
  height: 10%;
  background-color: var(--pink);
  transition: var(--transition);
`;

const NavbarMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  transition: var(--transition);
  @media (max-width: 768px) {
    & {
      top: -999px;
      left: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      flex-direction: column;
      padding: 3rem 0;
      background-color: var(--dark);
    }
  }
`;

const ItemsActive = styled(Items)`
  color: var(--pink);
`;
