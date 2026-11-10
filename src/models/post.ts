import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
