import React from "react";
import logo from "./logo.svg";
import { Typography, AppBar } from "@mui/material";
import {makeStyles } from 'tss-react/mui'
import VideoPlayer from "./components/VideoPlayer";
import Options from "./components/Options";
import Notification from "./components/Notification";
import "./App.css";

const useStyles = makeStyles()((theme:any)=> {
  return {
    appBar: {
      borderRadius: 15,
      margin: '30px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      border: '2px solid black',
  
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },
    image: {
      marginLeft: '15px',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }
})

function App() {

  const classes = useStyles(); 
  return (
    <div className={classes.classes.wrapper}>
      <AppBar className= {classes.classes.appBar}>
        <Typography variant="h2" align="center">
          Video Chat App
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Options></Options>
      <Notification />
    </div>
  );
}

export default App;
