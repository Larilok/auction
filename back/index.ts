import { Socket } from 'dgram'
import { createServer } from 'http'
import { Server } from 'socket.io'
const http = createServer()

const io = new Server(http, {
    cors: { origin: "*" }
})

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('message', (message) => {
        console.log(message)
        io.emit('message', `${socket.id.substr(0,2)} said ${message}` )   
    })
})

http.listen(8080, () => console.log('listening on http://localhost:8080') )