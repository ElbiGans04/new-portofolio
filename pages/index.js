import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import styleIndex from '../styles/index.module.css'
import styled from 'styled-components'
import Text from '../Components/Text'

export default function Home() {
  return (
      <React.Fragment>
        <Head>
          <title>Welcome</title>
        </Head>
        <Image className={styleIndex.profile} width="300" height="300" src="/images/profile.jpg"></Image>
        <TextParent> 
          <Text size={3}>Hello, i'm <span>Rhafael Bijaksana</span></Text>
          <Text size={2} margin="1rem 0 0 0">I'm a <span>Fullstack Developer</span></Text>
        </TextParent>
      </React.Fragment>
  )
}



const TextParent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`;