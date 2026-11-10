import type { ErrorRequestHandler ,Request, Response, NextFunction } from "express"
import config from "./config.js"
import jwt, { type JwtPayload } from "jsonwebtoken"
import User from "../models/user.js"
import logger from './logger.js'


import type { HydratedDocument, InferSchemaType } from "mongoose"
type UserDocument = HydratedDocument<InferSchemaType<typeof User.schema>>

declare global {
  namespace Express {
    interface Request {
      user: UserDocument
    }
  }
}

const getToken = (req: Request): string | null => {
  return req.cookies?.token ?? null
}

const verifyToken =  async (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req)

  if (token === null) {
    return res.status(401).json({ error: 'No token' })
  }

  const decodedToken = jwt.verify(token, config.JWT_SECRET!) as JwtPayload
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(401).json({ error: "User not found" })
  }

  req.user = user
  next()
}

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.code === 11000
  ) {
    return res
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired, please log in again' })
  } else if (error.name === 'NotBeforeError') {
    return res.status(401).json({ error: 'token is not active yet' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'SyntaxError' && error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid JSON in request body' })
  }

  next(error)
}


export default {
  verifyToken,
  requestLogger,
  unknownEndpoint,
  errorHandler
}
