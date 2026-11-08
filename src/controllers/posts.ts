import { Router, type Request, type Response } from 'express'
import Post from '../models/post.js'

const postRouter = Router()

postRouter.get('/', async (req: Request, res: Response) => {
  const posts = await Post.find({})
  res.status(200).json(posts)
})

postRouter.post('/', async (req: Request, res: Response) => {
  const { title, type, location, description, contact } = req.body
  const postObject = new Post({
    title,
    type,
    location,
    description,
    contact,
    resolved: false
  })

  const savedPost = await postObject.save()
  res.status(201).json(savedPost)
})

postRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  await Post.findByIdAndDelete(id)
  res.status(204).end()
})


export default postRouter