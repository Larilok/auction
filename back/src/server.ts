import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { setupSocket } from './socket/socketEventsRouter'
const httpServer = createServer()

const io = new Server(httpServer, {
  cors: { origin: "*" }
})

io.on('connection', (socket: Socket) => {
  setupSocket(socket, io)
})

httpServer.listen(8080, () => console.log('listening on http://localhost:8080'))
