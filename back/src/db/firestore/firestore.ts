import admin from 'firebase-admin'

const serviceAccount = require('../../../auction-3f5b6-firebase-adminsdk-11erk-7525b8d0a5.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const firestore = admin.firestore();


export default firestore

