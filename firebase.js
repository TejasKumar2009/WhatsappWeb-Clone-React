// Imports
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore"


// Firebase Config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Authentication Functions

const google_auth_provider = new GoogleAuthProvider();
const googleSignIn = async () => {
  try{
    const res = await signInWithPopup(auth, google_auth_provider)
    const user = res.user
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        photoUrl: user.photoURL
      });
    }
  }catch (err) {
    console.log(err)
    alert(err.message)
  }
}

const logout = () => {
  signOut(auth)
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore()

export {app, auth, db, googleSignIn, logout}

