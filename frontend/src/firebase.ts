// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
const appId = import.meta.env.VITE_FIREBASE_APP_ID
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
export const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
};