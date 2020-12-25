import { IData } from './typing'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { publishLogs } from './db/redis/pub'
const httpServer = createServer()

let currentBet = 0

const io = new Server(httpServer, {
    cors: { origin: "*" }
})

let betTimeout = 30 * 1000

let timerId: NodeJS.Timeout, auctionId: string

const disconnectClients = (): void => {
    clients.forEach(socket => socket.disconnect())
    clients.clear()
    clearTimeout(timerId)
    publishLogs({
        auctionId: auctionId,
        action: 'AUCTION ENDED'
    })
}

const endAuction = (): NodeJS.Timeout => setTimeout(disconnectClients, betTimeout)

const clients: Map<string, Socket> = new Map<string, Socket>()

io.on('connection', (socket: Socket) => {

    console.log('a user connected')
    clients.set(socket.id, socket)

    if (timerId == null) {
        timerId = endAuction()
        auctionId = uuidv4()
    }
    publishLogs({
        auctionId: auctionId,
        action: 'CONNECTION',
        clientId: socket.id
    })

    socket.on('message', (message) => {
        const data: IData = {
            auctionId: auctionId,
            action: 'MESSAGE',
            clientId: socket.id,
            data: message
        }

        console.log(`MESSAGE id: ${socket.id}`)
        clearTimeout(timerId)
        console.log(message)

        const clientBet = parseInt(message)
        if (clientBet > currentBet) {
            currentBet = clientBet
            io.emit('message', message)
            data.isBetSet = true
            publishLogs(data)
        } else {
            data.isBetSet = false
            publishLogs(data)
        }
        timerId = endAuction()
    })

    // socket.on('disconnecting', () => {
    //     console.log(`DISCONNECTING id: ${socket.id}`)
    //     console.log(socket.rooms) // the Set contains at least the socket ID
    // })

    socket.on('disconnect', (reason) => {
        console.log(`DISCONNECT id: ${socket.id}`)
        console.log(reason)
        publishLogs({
            auctionId: auctionId,
            action: 'CLIENT DISCONNECT',
            clientId: socket.id,
            data: reason
        })
    })
})

httpServer.listen(8080, () => console.log('listening on http://localhost:8080'))