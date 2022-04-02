import Button from '@src/components/Button';
import Input from '@src/components/Input';
import Label from '@src/components/Label';
import { DocMeta } from '@src/types/jsonApi';
import { fetcherGeneric } from '@src/utils/fetcher';
import HttpError from '@src/utils/httpError';
import upperFirstWord from '@src/utils/upperFirstWord';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<
    { status: 'iddle'; message?: string } | { status: 'loading' }
  >({ status: 'iddle' });
  const router = useRouter();

  const onSubmit = (e: React.BaseSyntheticEvent) => {
    if (state.status === 'iddle') {
      e.preventDefault();
      const callback = handleSubmit((data) => {
        setState({ status: 'loading' });
        fetcherGeneric<DocMeta>('/api/auth/login', {
          method: 'post',
          body: JSON.stringify({ type: 'Admin', attributes: data }),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        })
          .then((res) => {
            console.log(res);
            router.push('/admin/projects').catch((err) => console.log(err));
          })
          .catch((err) => {
            const message =
              err instanceof HttpError ? err.message : 'Error when request';
            setState({ status: 'iddle', message });
          });
      });

      callback().catch((err) => console.error(err));
    }
  };

  return (
    <Container
      boxShadow={
        state.status === 'loading'
          ? undefined
          : '2px 2px 7px rgba(0, 0, 0, 0.5)'
      }
      backgroundColor={state.status === 'loading' ? 'var(--dark)' : undefined}
    >
      <Head>
        <title>Login</title>
      </Head>

      {/* Transition */}
      <Transition
        in={state.status === 'iddle' && state.message !== undefined}
        timeout={500}
        nodeRef={ref}
      >
        {() => (
          <BoxCollapse
            maxHeight={
              ref.current &&
              state.status === 'iddle' &&
              state.message !== undefined
                ? ref.current.scrollHeight
                : 0
            }
            ref={ref}
          >
            <MessageParent>
              <p>
                {state.status === 'iddle' &&
                  state.message !== undefined &&
                  upperFirstWord(state.message)}
              </p>
              <AiOutlineClose
                title="close message"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setState({ status: 'iddle', message: undefined })
                }
                size="1.3em"
              />
            </MessageParent>
          </BoxCollapse>
        )}
      </Transition>
      <Form onSubmit={onSubmit}>
        {state.status == 'loading' ? (
          <div className="loader"></div>
        ) : (
          <React.Fragment>
            <FormRow>
              <Label size={1} minSize={1} htmlFor="email">
                Email :
              </Label>
              <Input
                placeholder="Enter your email"
                type="email"
                id="email"
                borderColor={errors.email && 'var(--red2)'}
                borderColor2={errors.email && 'var(--red)'}
                {...register('email', {
                  required: { value: true, message: 'Please insert email' },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please insert valid email',
                  },
                })}
              />
              {errors.email?.message && (
                <p
                  style={{
                    fontSize: '.9rem',
                    color: 'var(--red)',
                    margin: '0.5rem 0',
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </FormRow>
            <FormRow>
              <Label size={1} minSize={1} htmlFor="password">
                Password :
              </Label>
              <Input
                placeholder="Enter your password"
                type="password"
                id="password"
                borderColor={errors.password && 'var(--red2)'}
                borderColor2={errors.password && 'var(--red)'}
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Pleas insert your password',
                  },
                })}
              />
              {errors.password?.message && (
                <p
                  style={{
                    fontSize: '.9rem',
                    color: 'var(--red)',
                    margin: '0.5rem 0',
                  }}
                >
                  {errors.password.message}
                </p>
              )}
            </FormRow>
            <NewButton type="submit">Login</NewButton>
          </React.Fragment>
        )}
      </Form>
    </Container>
  );
}

const BoxCollapse = styled.div<{ maxHeight: number }>`
  overflow: hidden;
  max-height: ${({ maxHeight }) => `${maxHeight}px`}!important;
  transition: var(--transition);
  color: #842029;
  background-color: #f8d7da;
  width: 100%;
  border-radius: 0.3rem;
  padding: 0rem !important;
`;

const MessageParent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem;
  height: 100%;
`;

const Container = styled.div<{ backgroundColor?: string; boxShadow?: string }>`
  width: 50%;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || 'var(--dark2)'};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${({ boxShadow }) => boxShadow || ''};

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;
const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-template-rows: repeat(3, 1fr);
  flex-flow: column;
`;
const FormRow = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
`;

const NewButton = styled(Button)`
  width: 100%;
  margin: 1rem 0;
`;
