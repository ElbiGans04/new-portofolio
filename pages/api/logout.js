import withSession from "../../lib/module/withSession";

export default withSession(async function (req, res) {  
  await req.session.destroy('user');
  res.status(200).json({meta: {message: 'success', code: 200}})
})