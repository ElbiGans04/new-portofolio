import React from 'react';
import ErrorComponent from './Error'
import styled from 'styled-components'

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
        return (
          <ErrorContainer>
            <ErrorComponent></ErrorComponent>
          </ErrorContainer>
        )
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;

const ErrorContainer = styled.div`
  height: 100vh;
  background-color: var(--dark);
  display: grid;
  justify-items: center;
  align-items: center;
`;