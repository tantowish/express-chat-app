const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, ()=>console.log(`server running on http://localhost:${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket)=>{
    console.log(socket.id)
})