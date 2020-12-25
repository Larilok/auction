import redis from './redis'
import { IData } from '../../typing'

export const publishLogs = (logsData: IData): void => {
  redis.publish('logs', JSON.stringify(logsData))
}
