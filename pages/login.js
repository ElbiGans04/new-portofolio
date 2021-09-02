import useUser from '../lib/hooks/useUser'


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
        <form onSubmit={onSubmit}>
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" required></input>
            <label htmlFor="password">Password :</label>
            <input type="password" id="password" name="password" required></input>
            <button type="submit">Enter</button>
        </form>
    )
}