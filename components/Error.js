import styled from 'styled-components'
import Head from 'next/head'
import Image from 'next/image'
import Text from './Heading'

function ErrorComponent ({message, solution, src}) {
    return (<Container>
        <Head>
          <title>There is an error in the page :(</title>
        </Head>
        <Image width="300" height="300" alt="errror bro" src={src || "/images/problem.svg"}></Image>
        <ContainerText>
          <Text size={2}><span>{message || 'There is an error in the page :('}</span></Text>
          <Text size={1.5} margin="1rem 0">{solution || 'Please refresh the page'}</Text>
        </ContainerText>
      </Container>)
}

export default ErrorComponent;

const Container = styled.div`
display: grid;
width: 100%;
grid-template-rows: 2fr 1fr;
background-color: var(--dark);
`;
const ContainerText = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & h1:first-child {
    margin-bottom: .5rem;
  }
`;