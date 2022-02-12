import Head from 'next/head';
import styled from 'styled-components';
import Input from '@components/Input';
import Label from '@components/Label';
import Button from '@components/Button';
import { FormEvent, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { DocErrors, DocMeta } from '@typess/jsonApi';
import { Dispatch, SetStateAction } from 'react';
import useUser from '../hooks/useUser';
import { CSSTransition } from 'react-transition-group';

interface EventTargetType extends FormEvent<HTMLFormElement> {
  currentTarget: EventTarget &
    HTMLFormElement & {
      email: {
        value: string;
      };
      password: {
        value: string;
      };
    };
}

export default function Login() {
  const { mutateUser } = useUser({
    redirectTo: '/admin/projects',
    redirectIfFound: true,
  });
  const [message, setMessage] = useState<null | DocErrors>(null);
  async function onSubmit(event: EventTargetType) {
    try {
      event.preventDefault();

      // Value
      if (event.currentTarget !== null) {
        const body = {
          type: 'account',
          attributes: {
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value,
          },
        };

        // Mengembalikan Doc error atau metta
        const request = await fetch('/api/auth/login', {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        });

        if (!request.ok) {
          const request2 = (await request.json()) as DocErrors;
          setMessage(request2);
        }

        const request2 = (await request.json()) as DocMeta;

        await mutateUser(request2);
      }
    } catch (err) {
      alert('Found a error when trigger mutation data');
    }
  }
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      {/* Transition */}
      <CSSTransition
        in={message === null ? false : true}
        timeout={500}
        classNames="message-login"
      >
        <MessageParent>
          <MessageComponent setMessage={setMessage} message={message} />
        </MessageParent>
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
            name="email"
          />
        </FormRow>
        <FormRow>
          <Label size={1} minSize={1} htmlFor="password">
            Password :
          </Label>
          <Input
            placeholder="Enter your password"
            type="password"
            id="password"
            name="password"
          />
        </FormRow>

        <NewButton type="submit">Enter</NewButton>
      </Form>
    </Container>
  );
}

function MessageComponent({
  message,
  setMessage,
}: {
  message: DocErrors | null;
  setMessage: Dispatch<SetStateAction<DocErrors>>;
}) {
  let messageText = '';
  if (message !== null) {
    message.errors.forEach((value) => {
      messageText += `${value.title}, `;
    });
  }

  return (
    <MessageContainer>
      {messageText}
      <AiOutlineClose onClick={() => setMessage(null)} size="1.3rem" />
    </MessageContainer>
  );
}
const MessageParent = styled.div`
  width: 100%;
  height: 0;
  overflow: hidden;
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;

  // From Message container
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
  line-height: 1.3rem;
  border-radius: 0.4rem;
`;
const MessageContainer = styled.div`
  width: 100%;
  height: 100%;
  font-size: 0.9rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.5s;
  // untuk icon close
  & svg {
    margin-left: 0.3rem;
    cursor: pointer;
  }
`;

const Container = styled.div`
  width: 50%;
  // height: 50vh;
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
  onSubmit: (event: EventTargetType) => Promise<void>;
}>`
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: repeat(3, 1fr);
`;
const FormRow = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  // display: flex;
  // justify-content: space-between;
  // align-items: flex-start;
  // flex-wrap: wrap;
  // flex-direction: column;
`;

const NewButton = styled(Button)`
  width: 100%;
  margin-top: 0.3rem;
`;
