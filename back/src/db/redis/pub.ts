import redis from './redis'
import { IData } from '../../typing'

export const publishLogs = (logsData: IData): void => {
  logsData.calledAt = Date.now()
  redis.publish('logs', JSON.stringify(logsData))
}
