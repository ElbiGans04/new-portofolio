import Button from '@src/components/Button';
import Input from '@src/components/Input';
import Label from '@src/components/Label';
import { DocErrors, DocMeta } from '@src/types/jsonApi';
import { fetcherGeneric } from '@src/utils/fetcher';
import Head from 'next/head';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import useUser from '../hooks/useUser';

interface DataForm {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataForm>();
  const { mutateUser } = useUser({
    redirectTo: '/admin/projects',
    redirectIfFound: true,
  });
  const ref = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<null | DocErrors>(null);

  const onSubmit = handleSubmit((data) => {
    fetcherGeneric<DocMeta>('/api/auth/login', {
      method: 'post',
      body: JSON.stringify({ type: 'Admin', attributes: data }),
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .then((res) => {
        mutateUser(res).catch((err) => console.error(err));
      })
      .catch((err) => {
        setErrorMessage(err as DocErrors);
      });
  });

  const maxHeightMessage =
    ref.current &&
    parseInt(getComputedStyle(ref.current).maxHeight.split('px')[0]);

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      {/* Transition */}
      <CSSTransition
        in={errorMessage === null ? false : true}
        timeout={500}
        classNames="message-login"
        nodeRef={ref}
      >
        <BoxCollapse
          maxHeight={
            ref.current && errorMessage !== null && maxHeightMessage !== null
              ? maxHeightMessage <= 0
                ? ref.current.scrollHeight
                : maxHeightMessage
              : 0
          }
          ref={ref}
        >
          <MessageParent>
            <p>
              {errorMessage?.errors &&
                errorMessage.errors.map((error) => error.title).join(', ')}
            </p>
            <AiOutlineClose
              title="close message"
              style={{ cursor: 'pointer' }}
              onClick={() => setErrorMessage(null)}
              size="1.3em"
            />
          </MessageParent>
        </BoxCollapse>
      </CSSTransition>
      <Form onSubmit={onSubmit}>
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
              required: { value: true, message: 'Pleas insert your password' },
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

        <NewButton type="submit">Enter</NewButton>
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

const Container = styled.div`
  width: 50%;
  background-color: var(--dark2);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;
const Form = styled.form<{
  onSubmit: (e: any) => Promise<void>;
}>`
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
