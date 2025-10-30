'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, Storage } from 'firebase/storage';

let firebaseApp: FirebaseApp;

// Initialize Firebase
if (getApps().length) {
  firebaseApp = getApp();
} else {
    firebaseApp = initializeApp(firebaseConfig);
}

// Get service instances, correctly associating them with the app instance
const auth: Auth = getAuth(firebaseApp);
const firestore: Firestore = getFirestore(firebaseApp);
const storage: Storage = getStorage(firebaseApp);

export { firebaseApp, auth, firestore, storage };

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';