import Paragraph from '@src/components/Paragraph';
import Container from '@src/components/Container';
import Head from 'next/head';

function About() {
  return (
    <Container>
      <Head>
        <title>Tools</title>
      </Head>
      <Paragraph minSize={1} size={1.5} lineHeight="2">
        When I develop a web application I usually use{' '}
        <span>react or next js</span> as the frontend framework,{' '}
        <span>typescript</span> to make the code more predictable, use{' '}
        <span>mysql or mongodb</span> as the database,
        <span>express</span> js for the backend framework
      </Paragraph>
    </Container>
  );
}

export default About;
