import express from 'express'

const app = express()

app.get('/health-check', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

export default app