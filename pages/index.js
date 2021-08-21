import Head from 'next/head'
import Image from 'next/image'
import NavBar from '../Components/Navbar'
import styled from 'styled-components'

export default function Home() {
  return (
    <Container>
      <NavBar></NavBar>
      <Main>
        <Image width="300" height="300" src="/images/profile.jpg"></Image>
          <TextParent>
            <Text size="3rem">Hello, i'm {" "}</Text>
            <Text size="3rem" super={true}>{" "}Rhafael Bijaksana</Text>
          </TextParent>
          <TextParent>
            <Text size="2rem">I'm a {" "}</Text>
            <Text size="2rem" super={true}>Fullstack Developer</Text>
          </TextParent>
      </Main>
    </Container>
  )
}


const Container = styled.div`
  background-color: var(--dark);
  height: 100vh;
`;

const Main = styled.main`
  display: grid;
  justify-items: center;
`;

const Text = styled.h1`
  font-size: ${({size}) => size || '1rem'};
  color: ${ ({super: superText}) => superText ? 'var(--pink)' : 'white'};
  font-weight: ${ ({super: superText}) => superText ? 'bold' : 'normal'};
`;

const TextParent = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;