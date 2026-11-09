import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const { _id, __v, ...user } = returnedObject
    return { ...user, id: _id.toString() }
  }
})

const User = mongoose.model('User', userSchema)

export default User