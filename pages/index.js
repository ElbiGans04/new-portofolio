import Head from "next/head";
import Image from "next/image";
import React from "react";
import styleIndex from "../styles/index.module.css";
import styled from "styled-components";
import Heading from "../components/Heading";
import ProfileImage from "../public/images/profile.jpg";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Welcome</title>
      </Head>
      <ContainerImage>
        <Image
          className={styleIndex.profile}
          layout="fill"
          placeholder="blur"
          src={ProfileImage}
          alt="profile"
        ></Image>
      </ContainerImage>
      <TextParent>
        <Heading size={2.5} minSize={1.5}>
          Hello, i&apos;m <span>Rhafael Bijaksana</span>
        </Heading>
        <Heading size={2} minSize={1.3}>
          I&apos;m a <span>Fullstack Developer</span>
        </Heading>
        {/* <Heading>Reach me via email <span>rhafaelbijaksana04@gmail.com</span></Heading> */}
      </TextParent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: 2fr 1fr;

  @media (max-width: 576px) {
    padding-bottom: 2rem;
  }
`;

const ContainerImage = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  border: 0.3rem solid var(--pink) !important;
  border-radius: 50%;

  @media (max-width: 576px) {
    & {
      width: 250px;
      height: 250px;
    }
  }
`;

const TextParent = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  gap: 1rem;
`;
