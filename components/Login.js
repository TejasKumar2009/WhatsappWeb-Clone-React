import React from "react";

// Authentication & Firebase Imports
import { db } from "../firebase";
import { auth, googleSignIn } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  query,
  where,
  updateDoc,
  onSnapshot,
  doc
} from "firebase/firestore";

// Stylesheets Imports
import "../styles/Login.css";

// Ui Imports
import GoogleButton from "react-google-button";

const Login = () => {

  const [user, loading, error] = useAuthState(auth)
  console.log(user, loading)

   const loginToAccount = () => {
    googleSignIn()
   }

  return (
    <div className="login_container">
      <img
        className="login_whatsapp_image"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
        alt="WhatsApp Logo"
      />
      <h1>WhatsApp Login</h1>
      <GoogleButton onClick={loginToAccount} />
    </div>
  );
};

export default Login;
