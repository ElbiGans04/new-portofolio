import React from 'react';
import styled from 'styled-components'
import Head from 'next/head'
import Image from 'next/image'
import Text from './Text'

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo)
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (<Container>
          <Head>
            <title>There is an error in the page :(</title>
          </Head>
          <Image width={500} height={500} alt="errror bro" src="/images/problem.svg"></Image>
          <ContainerText>
            <Text size={3}><span>There is an error in the page :(</span></Text>
            <Text size={2} margin="1rem 0">Please refresh the page</Text>
          </ContainerText>
        </Container>)
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;

  const Container = styled.div`
    display: grid;
    width: 100%;
    height: 100vh;
    grid-template-rows: 2fr 1fr;
    background-color: var(--dark);
  `;
  const ContainerText = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `;