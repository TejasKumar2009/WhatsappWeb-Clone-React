import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom';

// Stylesheets Imports
import "../styles/SidebarChat.css"

// Auth & Firebase Imports
import { db } from '../firebase';
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  doc
} from "firebase/firestore";

// Ui Imports
import { Avatar } from '@material-ui/core'
import { useCollection } from 'react-firebase-hooks/firestore';

const SidebarChat = (props) => {

    //useAuthState
    const [user, loading, error] = useAuthState(auth);

    //useStates
    const [usersInfo, setUsersInfo] = useState({})
    const [lastMessage, setLastMessage] = useState("")

  // UseEffect
    useEffect(() => {  

      const fetchUserDetails = async () => {
      const usersQuery = query(collection(db, "users"), where("email", "==", props.recipientEmail));
      const usersQuerySnapshot = await getDocs(usersQuery);
      usersQuerySnapshot.forEach((udoc)=>{
        setUsersInfo(udoc.data())
      })
    }

    fetchUserDetails()

    }, [])

    // fetchLastMessage()
    
  return (
    <Link style={{color: 'black', textDecoration: 'none'}} to={`/chat/${props.id}`}>
    <div className="sidebarChat">
      { usersInfo ? 
       <Avatar src={usersInfo.photoUrl} />
       : 
       <Avatar>{usersInfo.name[0]}</Avatar>
      }

       <div className="sidebarChat_info">
       <h3>{usersInfo.name}</h3>
       <p>Last message...</p>
       </div>
    </div>
    </Link>
  )
}

export default SidebarChat