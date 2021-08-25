import styled from 'styled-components'
import Head from 'next/head'
import Image from 'next/image'
import Text from './Text'

function ErrorComponent ({message, solution, src}) {
    return (<Container>
        <Head>
          <title>There is an error in the page :(</title>
        </Head>
        <Image width={500} height={500} alt="errror bro" src={src || "/images/problem.svg"}></Image>
        <ContainerText>
          <Text size={3}><span>{message || 'There is an error in the page :('}</span></Text>
          <Text size={2} margin="1rem 0">{solution || 'Please refresh the page'}</Text>
        </ContainerText>
      </Container>)
}

export default ErrorComponent;

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