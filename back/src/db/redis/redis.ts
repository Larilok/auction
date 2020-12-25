import { createNodeRedisClient } from 'handy-redis'

const client = createNodeRedisClient()
client.nodeRedis.on('connect', () => {
  console.log('connected');
})

client.nodeRedis.on('error', (error) => console.log(error))
export default client
