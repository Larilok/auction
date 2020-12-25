import subscriber from './db/redis/redis'
import { writeLog } from './db/firestore/firestore'

subscriber.nodeRedis.on('message', (channel, message) => {
  console.log(`Subscriber received message in channel '${channel}': ${message}`)
  writeLog(JSON.parse(message))
})

subscriber.subscribe('logs')
