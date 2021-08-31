import Paragraph from "../Components/Paragraph";
import Container from "../Components/Container";
import Head from 'next/head'


function About() {
  return (
    <Container>
      <Head>
        <title>About Me</title>
      </Head>
      <Paragraph size="1.5" lineHeight="2">
        Yes it's me, My name is <span>Rhafael Bijaksana</span> my friends call me by the name <span>Elbi</span>. Since
        entering high school for some reason I have become fond of programming,
        for me it is very interesting to learn and there is a sense of
        satisfaction after solving the problems at hand.
      </Paragraph>
      <Paragraph size="1.5" lineHeight="2">
      Since then till now, I focus on <span>JavaScript development</span> mostly on <span>react js, redux, js next js</span> sometimes
      </Paragraph>
    </Container>
  );
}

export default About;