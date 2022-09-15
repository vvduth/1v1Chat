import React, { useCallback, useContext, useRef } from "react";
import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";

import { SocketContext } from "./SocketContext";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
  } = useContext(SocketContext) as any;

  console.log("compo ", myVideo.current)

  const classes = useStyles();
  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            {name || "Host: My own  name"}
          </Typography>
          <video
            playsInline
            ref={myVideo}
            muted
            autoPlay
            className={classes.video}
          />
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            {call.name || "Guest: My guest name"}
          </Typography>
          <video
            playsInline
            ref={userVideo}
            
            autoPlay
            className={classes.video}
          />
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
