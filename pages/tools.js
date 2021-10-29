import Paragraph from "../components/Paragraph";
import Container from "../components/Container";
import Head from "next/head";

function About() {
  return (
    <Container>
      <Head>
        <title>Tools</title>
      </Head>
      <Paragraph size="1.5" lineHeight="2">
        When I develop a web application I usually use <span>react or next js</span> as the
        frontend framework, <span>Redux</span> for state management, use <span>mysql or mongodb</span> as
        the database, <span>express</span> js for the backend framework
      </Paragraph>
    </Container>
  );
}

export default About;

