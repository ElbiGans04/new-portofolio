import Head from 'next/head';
import {
  IoLogoFacebook,
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail,
} from 'react-icons/io5';
import styled from 'styled-components';
import Container from '@src/components/Container';
import Paragraph from '@src/components/Paragraph';

function Contacts() {
  return (
    <Container>
      <Head>
        <title>Let&apos;s Connect with me</title>
      </Head>
      <Paragraph minSize={1} lineHeight="1.5" size={1.5}>
        You can reach out via email at <span>rhafaelbijaksana04@gmail.com</span>
        , or via socials below:
      </Paragraph>
      <ContainerIcon>
        <a href="https://github.com/ElbiGans04">
          <IoLogoGithub color="white" size="2em" title="github account" />
        </a>
        <a href="https://www.facebook.com/rhafael.bijaksana04">
          <IoLogoFacebook color="white" size="2em" title="facebook account" />
        </a>
        <a href="mailto:rhafaelbijaksana04@gmail.com">
          <IoMail color="white" size="2em" title="email account" />
        </a>
        <a href="https://www.linkedin.com/in/rhafael-bijaksana">
          <IoLogoLinkedin color="white" size="2em" title="linkedin account" />
        </a>
      </ContainerIcon>
    </Container>
  );
}

export default Contacts;

const ContainerIcon = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;

  & a {
    margin: 0 1rem;
  }
`;
