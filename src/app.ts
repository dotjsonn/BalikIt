import express from 'express'
import cookieParser from 'cookie-parser'
import config from './utils/config.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'
import authRouter from './controllers/auth.js'
import postRouter from './controllers/posts.js'

const app = express()

mongoose.connect(config.MONGODB_URI!)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB', error)
  })

app.use(express.json())
app.use(cookieParser())

app.get('/health-check', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
export default app