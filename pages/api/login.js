import withSession from "../../module/withSession";

export default withSession(async function (req, res) {
  const { email, password } = req.body;

  if (process.env.EMAIL !== email || process.env.PW !== password)
    return res.status(404).json({ errors: [{ title: "password or email does not match", code: 404 }] });

  req.session.set("user", {  isLoggedIn: true });

  await req.session.save();
  res.status(200).json({
    meta: { title: "success to login", code: 200, isLoggedIn: true },
  });
});
