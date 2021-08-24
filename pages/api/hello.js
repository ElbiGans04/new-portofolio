// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log(process.env.NEXT_PUBLIC_MONGODB_URI)
  res.status(200).json({ name: 'John Doe' })
}
