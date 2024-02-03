const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

// Run server
const server = app.listen(PORT, ()=>console.log(`server running on http://localhost:${PORT}`))

// Call socket
const io = require('socket.io')(server)

// make static public folder
app.use(express.static(path.join(__dirname, 'public')))

// Socket id list of set
let socketsConnected = new Set()

// Connecting to socket.io
io.on('connection', onConnected)

// Connected function
function onConnected(socket){
    // Connected log
    console.log("new socket connected : "+socket.id)
    socketsConnected.add(socket.id)

    // Emitting the data to FE
    io.emit('clients-total', socketsConnected.size)

    // Disconnected log
    socket.on('disconnect',()=>{
        console.log("socket disconnected", socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    // Handle emitted message
    socket.on('message', (data)=>{
        console.log(data)

        // Emitting to all client
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback', data)
    })
}