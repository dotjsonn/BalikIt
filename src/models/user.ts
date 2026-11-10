import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, { timestamps: true })

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const { _id, __v, ...user } = returnedObject
    return { ...user, id: _id.toString() }
  }
})

const User = mongoose.model('User', userSchema)

export default User
