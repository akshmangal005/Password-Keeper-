import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import  getSecretValue  from './pm.json';

async function initializeFirebase() {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(getSecretValue as any),
        });

        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
    }
}

initializeFirebase();

export { admin, getAuth };
