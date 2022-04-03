import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import Paragraph from '@src/components/Paragraph';
import React from 'react';
import fs from 'fs';
import { GetStaticProps } from 'next';
import upperFirstWord from '@src/utils/upperFirstWord';

export const getStaticProps: GetStaticProps = () => {
  const listFile = fs
    .readdirSync(`${process.cwd()}/src/pages/admin`)
    .filter((file) => file !== 'index.tsx')
    .map((file) => file.split('.')[0]);
  return {
    props: {
      listFile,
    },
  };
};

export default function Index({ listFile }: { listFile: string[] }) {
  return (
    <Container>
      <Head>
        <title>Pages you can access</title>
      </Head>
      <Paragraph size={1.5} minSize={1}>
        Pages you <span>can access</span>
      </Paragraph>

      <div>
        {listFile.map((value, index) => {
          return (
            <Link key={index} passHref href={`/admin/${value}`}>
              <Text>
                <span>{upperFirstWord(value)}</span>
                <span></span>
              </Text>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  gap: 2rem;

  & div {
    width: 100%;
    background-color: var(--dark2);
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 2rem;
    border-radius: 0.5rem;
  }

  @media (max-width: 768px) {
    & {
      gap: 2rem;
    }

    & div {
      padding: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
`;

const Text = styled.a`
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--pink2);
  border-radius: 0.3rem;

  &:hover span:first-child {
    color: var(--pink);
  }

  &:hover span:last-child {
    width: 100%;
  }

  & > span:first-child {
    padding: 0.3rem;
  }

  & > span:last-child {
    transition: 0.3s;
    width: 0%;
    background-color: var(--pink);
    height: 3px;
    margin-top: 0.8rem;
    align-self: flex-start;
  }

  @media (max-width: 768px) {
    & span:first-child {
      font-size: 1rem;
    }

    & > span:last-child {
      display: none;
    }
  }
`;
