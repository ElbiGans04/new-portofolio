import useUser from '../lib/hooks/useUser'
import Head from 'next/head'
import styled from 'styled-components'

export default function login () {
    const {mutateUser} = useUser({redirectTo: '/admin', redirectIfFound: true});
    
    async function onSubmit (event) {
        try {
            event.preventDefault()
            const body = new URLSearchParams();
        
            // Value
            body.append('email', event.currentTarget.email.value);
            body.append('password', event.currentTarget.password.value);
        
            await mutateUser(async () => {
                let {data} = await (await fetch('/api/login', {
                    method: 'post',
                    body: body.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })).json();
    
                return data
            })
            
        } catch (err) {
            console.error(err);
            alert("Found a error when trigger mutation data")
        }
    };
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <Form onSubmit={onSubmit}>
                <FormRow>
                    <Label htmlFor="email">Email :</Label>
                    <Input type="email" id="email" name="email" required></Input>
                </FormRow>
                <FormRow>
                    <Label htmlFor="password">Password :</Label>
                    <Input type="password" id="password" name="password" required></Input>
                </FormRow>
                
                    <Button type="submit">Enter</Button>              
    

            </Form>
        </Container>
    )
}


const Container = styled.div`
    width: 30%;
    height: 50vh;

    @media (max-width: 992px) {
        & {
            width: 50%;
        }
    }

    @media (max-width: 576px) {
        & {
            width: 90%;
        }
    }
`;
const Form = styled.form`
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
`;
const FormRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Label = styled.label`
    color: var(--pink);
    font-weight: bold;
    font-size: 1.3rem;
    @media (max-width: 576px) {
        & {
            font-size: 1rem;
        }
    }
`;

const Input = styled.input`
    appearance: none;
    box-sizing: border-box;
    padding: .5rem;
    border-radius: .5rem;
    &:focus {
        border: 3px solid var(--pink);
        outline: none;
    }

    @media (max-width: 576px) {
        & {
            padding: .3rem;
            border-radius: .3rem;
            width: 50%;
        }
    }
`;

const Button = styled.button`
    appearance: none;
    padding: .8rem;
    border-radius: .8rem;
    // background: var(--dark);
    // border: 3px solid var(--pink);
    // color: white;
    border: none;
    background-color: var(--pink);
    color: var(--dark);
    font-weight: bold;
`;