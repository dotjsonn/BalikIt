import { Router, type Request, type Response } from 'express'
import config from '../utils/config.js'
import middleware from '../utils/middleware.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
const authRouter = Router()

authRouter.post('/register', async (req: Request, res: Response) => {
  const {name, username, password} = req.body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    name,
    username,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json({message: `${savedUser.username} is registered successfully`})
})

authRouter.post('/login', async (req: Request, res: Response) => {
  const {username, password} = req.body

  const user = await User.findOne({ username })

  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'User cannot find' })
  }

  const passwordMatch =  await bcrypt.compare(password, user?.passwordHash)

  if (!(user && passwordMatch)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const payload = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(payload, config.JWT_SECRET!)

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    username: user.username,
    name: user.name
  })
})

authRouter.get('/me', middleware.verifyToken, (req: Request, res: Response) => {
  res.json({
    username: req.user.username,
    name: req.user.name
  })
})

authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', { path: '/' })
  res.status(200).json({message: 'Logged out'})
})


export default authRouter