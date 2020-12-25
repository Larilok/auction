import admin from 'firebase-admin'
import { IData } from '../../typing'

const serviceAccount = require('../../../auction-3f5b6-firebase-adminsdk-11erk-7525b8d0a5.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const firestore = admin.firestore();

export const writeLog = async (logsData: IData) => {
  const now = Date.now()
  logsData.calledAt = now
  
  const {auctionId, ...data} = logsData
  // console.log(data)

  let result
  try {
    result = await firestore.collection(`auction ${auctionId}`).doc(now.toString()).set(data)
  }
  catch(e) {
    console.log(e)
  }
  console.log(`Successful write to firestore ${result}`)
}

export default firestore

