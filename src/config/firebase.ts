const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}`,

  authDomain: `${
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_NAME || ''
  }.firebaseapp.com`,

  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_NAME || ''}`,

  storageBucket: `${
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_NAME || ''
  }.appspot.com`,

  messagingSenderId: '525183833327',

  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''}`,

  measurementId: 'G-6SXS8ZWC56',
};

export default firebaseConfig;
