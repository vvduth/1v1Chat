
import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';

import { SocketContext } from './SocketContext';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));


const VideoPlayer = () => {
  const classes = useStyles() ; 
  return (
    <Grid container className={classes.gridContainer}>
      <Paper className={classes.paper}>
        <Typography variant='h5' gutterBottom>
            Name: My own name
        </Typography>
        <video playsInline ref={null} muted autoPlay className={classes.video}/> 
      </Paper>


      <Paper className={classes.paper}>
        <Typography variant='h5' gutterBottom>
            Guest: My guest name
        </Typography>
        <video playsInline ref={null} muted  autoPlay className={classes.video}/> 
      </Paper>
    </Grid>
  )
}

export default VideoPlayer
