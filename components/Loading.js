import React from 'react'
import whatsapp_login_image from "../images/whatsapp_login_image.png"

// Ui Imports
import {
   LinearProgress,
   makeStyles,
   createStyles,
 } from "@material-ui/core";

const loading_div_style = {
   height: "100vh",
   width: "100vw",
   display: "flex",
   flexDirection: "column",
   justifyContent: "center",
   alignItems: "center",
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
    },
    linearProgress: {
      width: theme.spacing(30),
    },
  })
);


const Loading = () => {
   const classes = useStyles();
  return (
     <div style={loading_div_style} className={classes.root}>
       <img style={{height: "100px", width: "100px", marginBottom: "30px"}} src={whatsapp_login_image} alt="Whatsapp Logo" />
   <LinearProgress color='secondary' className={classes.linearProgress} />
   <h3 style={{fontWeight: "normal", marginTop: "20px"}}>Connecting...</h3>
    </div>
  )
}

export default Loading