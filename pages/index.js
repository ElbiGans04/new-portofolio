import Head from 'next/head'
import Image from 'next/image'
import NavBar from '../Components/Navbar'
import styled from 'styled-components'
import styleIndex from '../styles/index.module.css'

export default function Home() {
  return (
    <Container>
      <NavBar></NavBar>
      <Main>
        <Image className={styleIndex.profile} width="300" height="300" src="/images/profile.jpg"></Image>
        <TextParent> 
          <Text size="3rem">Hello, i'm <span>Rhafael Bijaksana</span></Text>
          <Text size="2rem" margin="1rem 0 0 0">I'm a <span>Fullstack Developer</span></Text>
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
  margin-top: 3rem;
  display: grid;
  justify-items: center;
`;

const Text = styled.h1`
  font-size: ${({size}) => size || '1rem'};
  margin: ${ ({margin}) => margin || '0 0 0 0'};
  color: white;
  
  & span {
    color: var(--pink);
    font-weight: bold;
  }
`;

const TextParent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`;