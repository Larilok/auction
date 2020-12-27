import { Server, Socket } from 'socket.io'
import { IData } from '../typing'
import { publishLogs } from '../db/redis/pub'
import { Auction } from '../auction/auction'

let auction: Auction

export const setupSocket = (socket: Socket, io: Server) => {
    console.log('a user connected')

    if (auction == null) {
        auction = new Auction()
        publishLogs({
            auctionId: auction.id,
            action: 'AUCTION START'
        })
    }

    auction.addParticipant(socket)
    socket.emit('message', auction.currentBet)
    console.log(auction.timer.timeLeft)
    socket.emit('time', auction.timer.timeLeft)

    publishLogs({
        auctionId: auction.id,
        action: 'CONNECT',
        clientId: socket.id
    })

    socket.on('message', (message) => {
        const data: IData = {
            auctionId: auction.id,
            action: 'MESSAGE',
            clientId: socket.id,
            data: message
        }

        console.log(`MESSAGE id: ${socket.id}`)
        auction.timer.resetTimer()
        console.log(message)

        const clientBet = parseInt(message)
        if (auction.setBet(clientBet, socket.id)) {
            io.emit('message', message)
            data.isBetSet = true
            publishLogs(data)
        } else {
            data.isBetSet = false
            publishLogs(data)
        }
    })

    socket.on('disconnect', (reason) => {
        console.log(`DISCONNECT id: ${socket.id}`)
        console.log(reason)
        publishLogs({
            auctionId: auction.id,
            action: 'DISCONNECT',
            clientId: socket.id,
            data: reason
        })
    })
}

export const disconnectClients = (io: Server): void => {
    auction.participants.forEach((socket:Socket) => socket.emit('win', auction.winnerId))
    publishLogs({
        auctionId: auction.id,
        action: 'AUCTION WINNER',
        data: auction.winnerId
    })
    auction.clearParticipants()
    publishLogs({
        auctionId: auction.id,
        action: 'AUCTION ENDED'
    })
    auction = null
}
