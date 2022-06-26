import { collection, getDoc, getDocs, orderBy, query, docs, doc } from "firebase/firestore";
import { db } from "../firebase";

import React, {useState} from "react";
import Chat from "./Chat";

const ChatId = ({messages, chat, kalu}) => {
   console.log(kalu)
  return <><h3>Chat with</h3><Chat /></>;
};

export default ChatId;

export async function getServerSideProps(context){
   const ref = doc(db, "chats", context.query.id)

   // Prepare Messages on the Server
   const messageRef = collection(db, "chats", context.query.id, "messages")
   const messageQuery = query(messageRef, orderBy("timestamp", "asc"))
   const chatQuerySnapshot = await getDocs(messageQuery)

   // const messageRes = await getDocs(ref, "messages").order('timestamp', 'asc').get()

   const messages = chatQuerySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
   })).map(messages => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime()
   }))

   //Prepare Chats
   const chatRes = await ref.get();
   const chat = {
      id: chatRes.id,
      ...chatRes.data(),
   }
   return {
      props: {
         messages: JSON.stringify(messages),
         chat: chat,
         kalu: "Blacky"
      }
   }
}
