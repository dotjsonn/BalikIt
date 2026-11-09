import { Router, type Request, type Response } from 'express'
import Post from '../models/post.js'
import middleware from '../utils/middleware.js'

const postRouter = Router()

postRouter.get('/', async (_req: Request, res: Response) => {
  const posts = await Post.find({}).populate('user', {username: 1, name: 1})
  res.status(200).json(posts)
})

postRouter.post('/', middleware.verifyToken, async (req: Request, res: Response) => {
  const { title, type, location, description, contact } = req.body
  const user = req.user

  if (!user) {
    return res.status(403).json({ error: 'Your account do not have permission to this' })
  }

  const postObject = new Post({
    title,
    type,
    location,
    description,
    contact,
    resolved: false,
    user: user._id
  })

  const savedPost = await postObject.save()
  user.posts = user.posts.concat(savedPost._id)
  await user.save()
  await savedPost.populate('user', {username: 1, name: 1})
  res.status(201).json(savedPost)
})

postRouter.delete('/:id', middleware.verifyToken ,async (req: Request, res: Response) => {
 const user = req.user

  if (!user) {
    return res.status(403).json({ error: 'Your account do not have permission to this' })
  }
  const id = req.params.id
  await Post.findByIdAndDelete(id)
  res.status(204).end()
})


export default postRouter