import React from 'react'

// StyleSheets Imports
import "../styles/Message.css"

// Auth Imports
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Ui Imports
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';

const Message = (props) => {

  return (
    <div className={props.sender==="me" ? "message-me" : "message-you"}>
       <span className='senderName'>{props.sender==="me" ? "You" : props.username}</span>
       <p>{props.message.message}</p>
       <span className='timestamp'>{new Date(props.message.timestamp.toDate()).toLocaleString()}</span>
       <DoneOutlinedIcon style={{display : props.sender==="me" ? null : 'none'}}className="ticks"/>
    </div>
  )
}

export default Message