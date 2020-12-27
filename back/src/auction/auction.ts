import { disconnectClients } from '../socket/socketEventsRouter'
import { Timer } from './timer'
import { Socket } from 'socket.io'

const betTimeout = 30 * 1000

export class Auction {
  id: string
  currentBet: number
  timer: Timer
  participants: Map<string, Socket> = new Map<string, Socket>()
  winnerId: string = null

  constructor() {
    this.timer = new Timer(betTimeout, disconnectClients)
    this.id = Date.now().toString()
    this.currentBet = Math.ceil(Math.random() * 500)
  }
  
  addParticipant(socket: Socket) {
    this.participants.set(socket.id, socket)
  }
  
  setBet(newBet: number, participantId: string): boolean {
    if(newBet > this.currentBet && newBet < Number.MAX_SAFE_INTEGER){
      this.currentBet = newBet
      this.winnerId = participantId
      return true
    }
    return false
  }
  
  clearParticipants(): void {
    this.participants.forEach(socket => socket.disconnect())
    this.participants.clear()
  }

}





