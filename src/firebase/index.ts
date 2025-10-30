'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

// This function initializes and returns the Firebase services.
// It's designed to be called once and the result reused.
function initializeFirebaseServices(): FirebaseServices {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  return { firebaseApp: app, auth, firestore, storage };
}

// We invoke the function once and export the resulting services.
// This ensures a singleton pattern for Firebase services across the client-side of the app.
const { firebaseApp, auth, firestore, storage } = initializeFirebaseServices();

export { firebaseApp, auth, firestore, storage };

// The initializeFirebase function is kept for compatibility with client-provider but now just returns the already initialized services.
export function initializeFirebase(): FirebaseServices {
    return { firebaseApp, auth, firestore, storage };
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
