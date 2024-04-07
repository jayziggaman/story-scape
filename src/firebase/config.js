import { initializeApp } from "firebase/app";
import { browserSessionPersistence, FacebookAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, setPersistence } from "firebase/auth"
import { collection, getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyAKRJdyH99LX3WFH0Y_ANJVQMHXf8_3fok",
  authDomain: "storyscape-aebe1.firebaseapp.com" || 'localhost' || 'storyscape-aebe1.web.app' || '172.20.10.7',
  projectId: "storyscape-aebe1",
  storageBucket: "storyscape-aebe1.appspot.com",
  messagingSenderId: "279609880706",
  appId: "1:279609880706:web:ac7f64e62c9ef51249449b",
  measurementId: "G-2606ZBLMPK"
};




// const firebaseConfig = {
//   apiKey: "AIzaSyAKRJdyH99LX3WFH0Y_ANJVQMHXf8_3fok",
//   authDomain: "https://wowi-media.web.app",
//   // authDomain: "storyscape-aebe1.firebaseapp.com",
//   projectId: "storyscape-aebe1",
//   appId: "1:279609880706:web:ac7f64e62c9ef51249449b",
// };



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence)

export const db = getFirestore(app)

export const articlesRef = collection(db, 'articles')

export const usersRef = collection(db, 'users')

export const storage = getStorage(app)

export const githubProvider = new GithubAuthProvider()

export const facebookProvider = new FacebookAuthProvider()

export const googleProvider = new GoogleAuthProvider()




// 402071d49ce3cd090925eb6a0b28c833
