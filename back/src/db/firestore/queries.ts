import { IData } from '../../typing'
import firestore from './firestore'

export const writeLog = async (logsData: IData) => {
  let { auctionId, calledAt, action, ...data } = logsData

  let result
  try {
    if (action.startsWith('AUCTION')) {
      const split = action.split(' ')
      if ('data' in data) {
        data.data = `${split[1]} is ${data.data}`
      } else {
        data.data = split[1]
      }
      result = await firestore.collection(`auction ${auctionId}`).doc(split[0]).set({ [calledAt]: JSON.stringify(data) }, { merge: true })
    } else {
      result = await firestore.collection(`auction ${auctionId}`).doc(action).set({ [calledAt]: JSON.stringify(data) }, { merge: true })
    }
  }
  catch (e) {
    console.log(e)
  }
  console.log(`Successful write to firestore ${result}`)
}
