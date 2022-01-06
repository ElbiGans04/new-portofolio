import useUser from '../hooks/useUser'
import Head from 'next/head'
import styled from 'styled-components'
import Input from '@components/Input'
import Label from '@components/Label'
import Button from '@components/Button'
import {FormEvent} from 'react'
import {AiOutlineClose} from 'react-icons/ai'
import { DocErrors, DocMeta } from '@typess/jsonApi'
import { useState } from 'react'
import { SetStateAction } from 'hoist-non-react-statics/node_modules/@types/react'

interface EventTargetType extends FormEvent<HTMLFormElement> {
    currentTarget: EventTarget & HTMLFormElement & {
        email: {
            value: string
        },
        password: {
            value: string
        }
    }
}

export default function Login () {
    const {mutateUser} = useUser({redirectTo: '/admin/projects', redirectIfFound: true});
    const [message, setMessage] = useState(null);
    async function onSubmit (event: EventTargetType) {
        try {
            event.preventDefault()
        
            // Value
            if (event.currentTarget !== null) {
                let body = {
                    type: 'account',
                    attributes : {
                        email : event.currentTarget.email.value,
                        password: event.currentTarget.password.value
                    }
                }
                
                let request = await fetch('/api/auth/login', {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                    },
                });

                const request2 = await request.json();
                if (!request.ok) setMessage(request2)
                
                mutateUser(request2)
                
            }
            
            
        } catch (err) {
            alert("Found a error when trigger mutation data")
        }
    };
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <Form onSubmit={onSubmit}>
                <MessageComponent setMessage={setMessage} message={message} />
                <FormRow>
                    <Label size={1} minSize={1} htmlFor="email">Email :</Label>
                    <Input placeholder="Enter your email" type="email" id="email" name="email" ></Input>
                </FormRow>
                <FormRow>
                    <Label size={1} minSize={1} htmlFor="password">Password :</Label>
                    <Input placeholder="Enter your password" type="password" id="password" name="password" ></Input>
                </FormRow>
                
                    <NewButton type="submit">Enter</NewButton>              
    

            </Form>
        </Container>
    )
};

function MessageComponent ({message, setMessage} : {message: DocErrors | null, setMessage: SetStateAction<any>}) {
    let messageText = ''
    if(message !== null) {
        message.errors.forEach((value) => {
            messageText += `${value.title}, `
        })
    };
   
    return (
        <MessageContainer visible={message === null ? false : true}>
            {messageText}
            <AiOutlineClose onClick={() => setMessage(null)} size="1.3rem"></AiOutlineClose>
        </MessageContainer>
    )
}

const MessageContainer = styled.div<{visible: boolean}>`
    width: 100%;
    padding: .5rem;
    font-size: .9rem;
    border-radius: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    visibility: ${({visible}) => visible ? 'visible' : 'hidden'};
    // background-color: #F46F6F;
    // color: #f20909;
    // background-color: var(--dark);
    // color: var(--pink);
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
    line-height: 1.3rem;
    // untuk icon close
    & svg {
        margin-left: .3rem;
        cursor: pointer;
    }
`

const Container = styled.div`
    width: 50%;
    height: 50vh;
    background-color: var(--dark2);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 2px 2px 7px rgba(0,0,0, 0.5);

    @media (max-width: 768px) {
        & {
            width: 90%;
        }
    }
`;
const Form = styled.form<{onSubmit: (event: EventTargetType) => Promise<void>}>`
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
    margin-top: 1.5rem;
`