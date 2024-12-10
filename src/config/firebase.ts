import firebase from 'firebase-admin'

interface FirebaseConfig {
  projectId: string
  clientEmail: string
  privateKey: string
}

const firebaseConfig: FirebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID ?? '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
  privateKey: process.env.PRIVATE_KEY ?? '',
}

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  storageBucket: process.env.FB_STORAGE_BUCKET ?? '',
})

export default firebase
