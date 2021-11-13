import withSession from "../../middleware/withSession";

export default withSession(async function (req, res) {  
  const user = req.session.get('user')

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      meta : {
        isLoggedIn: true,
        ...user,
      }
    })
  } else {
    res.json({
      meta: {
        isLoggedIn: false,
      }
    })
  }
})