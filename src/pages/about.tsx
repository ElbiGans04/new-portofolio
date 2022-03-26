import Paragraph from '@src/components/Paragraph';
import Container from '@src/components/Container';
import Head from 'next/head';

function About() {
  return (
    <Container>
      <Head>
        <title>About Me</title>
      </Head>
      <Paragraph minSize={1} size={1.5} lineHeight="2">
        Hello Everybody, I&apos;m <span>Rhafael Bijaksana (Elbi)</span>. Since
        entering high school for some reason I have become fond of programming,
        for me it is very interesting to learn and there is a sense of
        satisfaction after solving the problems at hand.
      </Paragraph>
      <Paragraph minSize={1} size={1.5} lineHeight="2">
        Since then till now, I focus on{' '}
        <span>JavaScript development (MERN STACK)</span> mostly on{' '}
        <span>react or next js</span> as the frontend framework,{' '}
        <span>typescript</span> to make the code more predictable, use{' '}
        <span>mysql or mongodb</span> as the database,
        <span>express</span> js for the backend framework
      </Paragraph>
    </Container>
  );
}

export default About;
