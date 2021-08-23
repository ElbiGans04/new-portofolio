import Text from "../Components/Text";
import Paragraph from "../Components/Paragraph";
import Container from "../Components/Container";
import Head from 'next/head'


function About() {
  return (
    <Container>
      <Head>
        <title>About Me</title>
      </Head>
      <Text size="3">
        <span>About</span>
      </Text>
      <Paragraph size="1.5" margin="2rem 0 0 0" lineHeight="2">
        Yes it's me, my friends call me by the name <span>rhafael</span>. since
        entering high school for some reason I have become fond of programming,
        for me it is very interesting to learn and there is a sense of
        satisfaction after solving the problems at hand .
      </Paragraph>
    </Container>
  );
}

export default About;