import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import styleIndex from '../styles/index.module.css'
import styled from 'styled-components'
import Heading from '../Components/Heading'

export default function Home() {
  return (
      <React.Fragment>
        <Head>
          <title>Welcome</title>
        </Head>
        <Image className={styleIndex.profile} width="300" height="300" src="/images/profile.jpg"></Image>
        <TextParent> 
          <Heading size={3}>Hello, i'm <span>Rhafael Bijaksana</span></Heading>
          <Heading size={2} margin="1rem 0 0 0">I'm a <span>Fullstack Developer</span></Heading>
        </TextParent>
      </React.Fragment>
  )
}



const TextParent = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
`;