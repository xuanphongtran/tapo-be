import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import accountRouter from './routes/Account.js'
import groupRouter from './routes/Group.js'
import dmChatRouter from './routes/DMChat.js'
import groupChatRouter from './routes/GroupChat.js'
import imageRouter from './routes/Image.js'
import { Server } from 'socket.io'
import { getChatDMDataAndReturn } from './controller/DMChat.js'
import { getChatGroupDataAndReturn } from './controller/GroupChat.js'

//App set up
const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)
// app.use(express.static(__dirname + '/public'))
app.use(express.json())
var port = process.env.PORT || 8080
var server = app.listen(port, () => {
  console.log('Server is running')
})
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
})
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  socket.on('on-chat', async (data) => {
    if (data.type === 'dm') {
      const result = await getChatDMDataAndReturn(data)
      io.emit('user-chat', result)
    } else {
      const result = await getChatGroupDataAndReturn(data)
      io.emit('user-chat', result)
    }
  })
  socket.on('disconnect', () => {
    console.log(`bye ${socket.id}`)
  })
})
//Set up mongoose
mongoose.connect(process.env.MONGO_CLOUD_URL)
//Router
app.get('/', (req, res) => {
  res.send(
    'This is E-tapo calling app server api side, this server is running very well. Hope you are having a wonderful day',
  )
})
app.use('/api/Account', accountRouter)
app.use('/api/Group', groupRouter)
app.use('/api/DMChat', dmChatRouter)
app.use('/api/GroupChat', groupChatRouter)
app.use('/api/Image', imageRouter)
