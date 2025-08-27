// Simplified Firebase configuration for better performance
// This allows the app to run in demo mode without Firebase setup

let app: any = null;
let auth: any = null;
let db: any = null;

// Check if Firebase environment variables are available
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (hasFirebaseConfig) {
  // Firebase is properly configured - import and use real Firebase
  try {
    const {initializeApp, getApps, getApp} = require('firebase/app');
    const {getAuth} = require('firebase/auth');
    const {getFirestore} = require('firebase/firestore');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  // Create lightweight mock objects for demo mode
  app = { name: 'demo-app' };
  
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      callback(null);
      return () => {};
    }
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        set: () => Promise.resolve(),
        get: () => Promise.resolve({ data: () => null, exists: false }),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: 'demo-id' }),
      where: () => ({
        get: () => Promise.resolve({ docs: [], empty: true })
      })
    })
  };
}

export {app, auth, db};
