import withSession from "../../lib/module/withSession";

export default withSession(async function (req, res) {
  const {email, password} = req.body;
  
  if (process.env.EMAIL !== email || process.env.PW !== password) return res.status(404).json({meta: {message: 'failed', code: 404}})

  req.session.set("user",  {type: 'user', attributes: {isLoggedIn: true}});

  await req.session.save();
  res.json({meta: {message: 'success', code: 200}, data: {type: 'user', attributes: {isLoggedIn: true}}})
})