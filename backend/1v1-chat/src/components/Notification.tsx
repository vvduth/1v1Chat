
import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { SocketContext } from './SocketContext';

const Notification = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext) as any;

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
}

export default Notification
