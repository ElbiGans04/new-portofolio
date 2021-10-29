import useUser from '../lib/hooks/useUser'
import Head from 'next/head'
import styled from 'styled-components'
import Input from '../components/Input'
import Label from '../components/Label'
import Button from '../components/Button'

export default function Login () {
    const {mutateUser} = useUser({redirectTo: '/admin/projects', redirectIfFound: true});
    
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
                    <Input placeholder="Enter your email" type="email" id="email" name="email" required></Input>
                </FormRow>
                <FormRow>
                    <Label htmlFor="password">Password :</Label>
                    <Input placeholder="Enter your password" type="password" id="password" name="password" required></Input>
                </FormRow>
                
                    <NewButton type="submit">Enter</NewButton>              
    

            </Form>
        </Container>
    )
}


const Container = styled.div`
    width: 30%;
    height: 50vh;
    background-color: var(--dark2);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 2px 2px 7px rgba(0,0,0, 0.5);

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
    flex-wrap: wrap;
`;

const NewButton = styled(Button)`
    width: 100%;
`