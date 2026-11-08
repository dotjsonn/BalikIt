import express from 'express'
import config from './utils/config.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'
import postRouter from './controllers/posts.js'

const app = express()

mongoose.connect(config.MONGODB_URI!)
  .then(() => {
    logger.info('Connected to MongoDNB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB', error)
  })

app.use(express.json())

app.get('/health-check', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/posts', postRouter)
export default app