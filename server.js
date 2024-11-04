import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';

const app = express()
const PORT = process.env.PORT || 3000;

// Connect to db
await mongoose.connect(process.env.ATLAS_URI);
console.log('Connected to Mongo!')

// Pulling in User Model
import Post from './models/Post.js'
import User from './models/User.js'

// Turning off auto indexing for production environments
// mongoose.set("autoIndex", false)
const newUser = new User({
  name: "jill Doe",
  email: "cool@test.com",
  password: "34134",
  username: "doejohn123"
})

// RUN THIS LINE OF CODE IN ORDER FOR LINES 27-34 TO WORK 
await newUser.save()

// ==========================================
// Using the custom instance method
console.log(newUser.sayHello())

// Using the custom static method
const user = await User.getByUsername("doejohn123")

// Using the virtual yellName property
console.log(user.yellName)
// ==========================================





// await newUser.save()

app.use(express.json())



// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users)
  } catch (err) {
    res.send(err).status(400)
  }
});

// Get by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    res.send(err).status(400)
  }
})


// Create User
app.post('/users', async (req, res) => {
  try {
    //Instance methods
    // const user = new User(req.body)
    // await user.validate()
    // await user.save()

    // Static method
    const newUser = await User.create(req.body)
    res.status(200).json(newUser)
  } catch (err) {
    res.send(err).status(400)
  }
})

// Get User posts
app.get('/users/:id/posts', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts")
    res.status(200).json(user)
  } catch (err) {
    res.send(err).status(400)
  }
})


// Create a post 
app.post("/posts/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(400).send("No user with that ID");
      return
    }
    const post = new Post(req.body)
    post.userId = user._id

    user.posts.push(post._id)

    await post.save();
    await user.save();

    res.status(201).json(post)
  } catch (err) {
    res.send(err).status(400)
  }
})



// Update User
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedUser)
  } catch (err) {
    res.send(err).status(400)
  }
})

// Delete User
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json(deletedUser)
  } catch (err) {
    res.send(err).status(400)
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})