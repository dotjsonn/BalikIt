import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  location: String,
  description: String,
  contact: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

postSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const { _id, __v, ...post } = returnedObject
    return { ...post, id: _id.toString() }
  }
})

const Post = mongoose.model('Post', postSchema)

export default Post