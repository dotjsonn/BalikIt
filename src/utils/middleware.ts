import type { Request, Response, NextFunction } from "express"
import config from "./config.js"
import jwt, { type JwtPayload } from "jsonwebtoken"
import User from "../models/user.js"

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


export default {
  verifyToken
}