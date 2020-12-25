// import { IRedisExpire, IRedisStringRecord } from '../../typing'
import redis from './redis'
import { setRedisLog } from '../firestore/firestore'

const getString = async (key: string):Promise<string> => {
  let result = await redis.get(key)

  const data = {
    funcName: 'getString',
    argument: key,
    result: result,
  }
  await setRedisLog(data)

  return result
}

const setKey = async (record: IRedisStringRecord):Promise<string> => {
  const result = await redis.set(record.key, record.value)

  const data = {
    funcName: 'setKey',
    argument: record,
    result: result,
  }
  await setRedisLog(data)

  return result
}

const deleteKey = async (...keys: string[]):Promise<string> => {
  const response = await redis.del(...keys)
  const result = `Deleted: ${response} keys`

  const data = {
    funcName: 'deleteKey',
    argument: keys,
    result: result,
  }
  await setRedisLog(data)

  return result
}

const expireKey = async (redisExpire: IRedisExpire):Promise<string> => {
  const response = await redis.expire(redisExpire.key, redisExpire.seconds) 
  const result = response ? 'OK' : 'not exists'

  const data = {
    funcName: 'expireKey',
    argument: redisExpire,
    result: result,
  }
  await setRedisLog(data)

  return result
}


export interface IConnection {
  getString: typeof getString,
  deleteKey: typeof deleteKey,
  setKey: typeof setKey,
  expireKey: typeof expireKey
}

export const createQueriesInterface = async ():Promise<IConnection> => {
  return {
    deleteKey,
    getString,
    setKey,
    expireKey
  }
}

export default { createQueriesInterface }

