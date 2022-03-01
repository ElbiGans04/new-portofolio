import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import Text from '@src/components/Heading';

function ErrorComponent({
  message,
  solution,
  src,
}: {
  message: string;
  solution: string;
  src: string;
}) {
  return (
    <Container>
      <Head>
        <title>There is an error in the page :(</title>
      </Head>
      <Image width="300" height="300" alt="errror bro" src={src} />
      <ContainerText>
        <Text minSize={1} size={2}>
          <span>{message}</span>
        </Text>
        <Text minSize={1} size={1.5}>
          {solution}
        </Text>
      </ContainerText>
    </Container>
  );
}

export default ErrorComponent;

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 2fr 1fr;
  background-color: var(--dark);
`;
const ContainerText = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & h1:first-child {
    margin-bottom: 0.5rem;
  }
`;
