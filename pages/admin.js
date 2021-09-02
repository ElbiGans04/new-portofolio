import useUser from "../lib/hooks/useUser";

function Admin () {
    const {user} = useUser({redirectTo: '/login'});

    if (!user || user.isLoggedIn === false) {
      return <div>loading...</div>
    }
  
    return (
        <h1>Hello this is admin page</h1>
    )
}

export default Admin