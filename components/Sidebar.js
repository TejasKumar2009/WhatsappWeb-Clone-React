import React, { useState, useEffect } from "react";
import validator from "validator";

// Files Import
import SidebarChat from "./SidebarChat";

// Authentication Imports
import { db, auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

//Stylesheets Import
import "../styles/Sidebar.css";
import CircularProgress from '@material-ui/core/CircularProgress';

// Ui Imports
import { Avatar, Button, IconButton } from "@material-ui/core";
import {
  DonutLargeOutlined,
  RestaurantRounded,
  SearchOutlined,
} from "@material-ui/icons";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToApp from "@material-ui/icons/ExitToApp";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  setDoc,
  getDoc,
  doc,
} from "firebase/firestore";

const Sidebar = () => {

  //useAuthState
  const [user, loading, error] = useAuthState(auth);

  // All UseStates
  // const [chatUsers, setChatUsers] = useState([]);
  const [chatUsers, setChatUsers] = useState(["HOHOHO"]);

  // useEffect
  useEffect(() => {

    // Chats Refference & Query
    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("users", "array-contains", user.email))

    // Unsubscribe method
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setChatUsers(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
        })
    
    return unsubscribe
    
  }, [])

  // startNewChat function starts new chat with the user you want
  const startNewChat = async () => {

    // UserChat Refference and Snapshot
    const userChatRef = collection(db, "chats");
    const queryChatsSnapshot = await getDocs(query(userChatRef, where("users", "array-contains", user.email)));

    // Chat Already Extsts Function: Checks Chat Already Exists or Not
    const chatAlreadyExists = (recipientEmail) => {
      return !!queryChatsSnapshot?.docs.find(
        (chat) =>
          chat.data().users[1] === recipientEmail && chat.data().users[0] === user.email?.length > 0
      );    
    }

    // Recipient Email Input
    const newChatEmailPrompt = prompt("Enter the email address of anyone you want to talk with");

    // Checks for Start New Chat
    if (validator.isEmail(newChatEmailPrompt) && !chatAlreadyExists(newChatEmailPrompt) && newChatEmailPrompt !== user.email) {
      await addDoc(userChatRef, {
           users: [user.email, newChatEmailPrompt],
         });
         alert("New Chat Added - ", newChatEmailPrompt);
         
       } else {
         alert("Please Enter valid Email Address!");
       }
  }

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user.photoURL} />
        <div className="sidebar_header_right">
          <IconButton>
            <DonutLargeOutlined />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <ExitToApp />
          </IconButton>
        </div>
      </div>

      <div className="sidebar_search">
        <div className="sidebar_search_container">
          <SearchOutlined />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>

      <div className="sidebar_chats">
        <Button onClick={startNewChat} className="start_new_chat">
          Start a New Chat
        </Button>

        {/* We will fix loader in future */}
        {/* {loading ? <CircularProgress style={{marginLeft : "50%"}} /> : null} */}

        {/* List of all chats */}
        {chatUsers.map(chat => (
          chat.users?.[1] !== user.email ?
          <SidebarChat key={chat.id} id={chat.id} recipientEmail={chat.users?.[1]} chatUsers={chatUsers} />
          : null
        ))}

      </div>
    </div>
  )
};

export default Sidebar;
