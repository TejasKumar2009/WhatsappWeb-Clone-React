import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

// Auth & Firebase Imports
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  query,
  onSnapshot,
  where,
  orderBy,
  doc,
} from "firebase/firestore";

// File Imports
import Message from "./Message";

// Stylesheets imports
import "../styles/Chat.css";

// Ui Imports
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import SentimentSatisfiedAltOutlinedIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";

const Chat = () => {
  const [user] = useAuthState(auth);
  const [recipientInfo, setRecipientInfo] = useState();
  const [userChats, setUserChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  let { chatId } = useParams();

  const [messageInput, setMessageInput] = useState("");

  const fetchUserChats = async () => {
    const userChatRef = collection(db, "chats");
    const userChatQuery = query(
      userChatRef,
      where("users", "array-contains", user.email)
    );
    const unsubscribe = onSnapshot(userChatQuery, (querySnapshot) => {
      setUserChats(
        querySnapshot.docs.map((doc) =>
          doc.id === chatId ? { ...doc.data(), id: doc.id } : null
        )
      );
      setUserChats((chats) => chats.filter((value) => value !== null));
    });

    return unsubscribe;
  };

  const fetchUserDetails = async (recipientEmail) => {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", recipientEmail)
    );
    const usersQuerySnapshot = await getDocs(usersQuery);
    usersQuerySnapshot.forEach((udoc) => {
      setRecipientInfo(udoc.data());
    });
  };

  const showMessages = async () => {
    const messagesArray = []
    const messagesSnapshot = await getDocs(query(collection(db, "messages"), orderBy("timestamp", "asc")));
    messagesSnapshot.forEach((message)=>{
      if (message.data().to === user.email && message.data().from === recipientInfo.email || message.data().from === user.email && message.data().to === recipientInfo.email ){
        messagesArray.push(message.data())
      }
      setChatMessages(messagesArray)
    })
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const currentTime = new Date()

     const messagesRef = await addDoc(collection(db, "messages"), {
      message: messageInput,
      timestamp: currentTime,
      from : user.email,
      to: recipientInfo.email,
     })

    setMessageInput("");
  };

  useEffect(() => {
    fetchUserChats();
  }, [chatId]);

  // useEffect(() => {
  //   showMessages()
  // }, [chatMessages]);

  fetchUserDetails(userChats?.[0]?.users?.[1]);
  // showMessages()
  showMessages()
  console.log(chatMessages)


  return (
    <>
      <div className="chat">
        <div className="chat_header">
          {recipientInfo ? (
            <Avatar src={recipientInfo?.photoUrl} />
          ) : (
            <Avatar>{recipientInfo?.name?.[0]}</Avatar>
          )}
          <div className="chat_header_info">
            <h3>{recipientInfo?.name}</h3>
            <p>Last seen at 06:31</p>
          </div>
          <div className="chat_header_right">
            <IconButton>
              <SearchOutlined />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </div>
        </div>

        <div className="chat_messages">
        
          {chatMessages.map((message)=>{

            return (
              <>
              <Message message={message} username={recipientInfo?.name} sender={message.from===user.email ? "me" : "you"} />
              </>
            )
          })}

        </div>

        <div className="chat_footer">
          <div className="chat_footer_icons">
            <IconButton>
              <SentimentSatisfiedAltOutlinedIcon />
            </IconButton>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
          </div>
          <form onSubmit={sendMessage} className="send_messages">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="message_input"
              type="text"
              placeholder="Type a message"
            />
          </form>
          <IconButton>
            <KeyboardVoiceIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Chat;
