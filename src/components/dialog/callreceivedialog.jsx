import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, IconButton, Stack, Typography } from "@mui/material";
import {  Call as CallIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setisCallComing, setNoofTryforConnection } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import { CALL_ACCEPTED, CALL_REJECTED } from "../../constants/events";
import { useNavigate } from "react-router-dom";
function CallReceive({IncomingUser,ringtoneRef ,timerRef,hasUserInteracted, setHasUserInteracted}) {
    const navigate=useNavigate()
     const {  isCallComing,NoOfTryforConnection } = useSelector((state) => state.misc);
     const stopRingtone = () => {
      if (ringtoneRef.current) {
          ringtoneRef.current.pause();
          ringtoneRef.current.currentTime = 0;
          ringtoneRef.current=null // Reset to the beginning
      }
  };
    
    const dispatch=useDispatch()
  
  const {user}=useSelector((state)=>state.auth)
    const socket=getSocket()
  const callrejected=async()=>{
    dispatch(setisCallComing(false))
    stopRingtone()
    dispatch(setNoofTryforConnection(1))
    socket.emit(CALL_REJECTED,{UserId:IncomingUser.UserId,Name:user.name})


  }
  const callaccepted=async()=>{
    dispatch(setNoofTryforConnection(1))
    dispatch(setisCallComing(false))
    
    stopRingtone()
    socket.emit(CALL_ACCEPTED,{UserId:IncomingUser.UserId,Name:user.name,CallReceivingUserId:user._id})
    navigate(`/room/${IncomingUser.RoomId}`)
  }
  

  useEffect(() => {
    if (isCallComing && NoOfTryforConnection===0) {
      if (!hasUserInteracted) {
        return;
      }
  
      const playRingtone = () => {
        if (!ringtoneRef.current) {
         
          ringtoneRef.current = new Audio("../../../ringtone-126505.mp3");
        }
  
        ringtoneRef.current.play().then(() => {
         
          setHasUserInteracted(true)
          
          setTimeout(()=>{
            if( ringtoneRef.current?.currentTime && NoOfTryforConnection===0)
                ringtoneRef.current.currentTime = 0;
            playRingtone()},29000); 
        }).catch(err => {
          console.error("Error playing ringtone: ", err);
        });
      };
  
      
      playRingtone();
  
      
      return () => {
        if (ringtoneRef.current) {
          ringtoneRef.current.pause();
          if(ringtoneRef.current.currentTime)
           ringtoneRef.current.currentTime = 0;
          ringtoneRef.current = null;
        }
        dispatch(setNoofTryforConnection(1));
        stopRingtone()
      };
    }
  }, [isCallComing, hasUserInteracted]);
  return (
    <Dialog open={isCallComing}>
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: "whitesmoke",
        }}
      >
        <Stack
          direction={"column"}
          justifyContent={"center"}
          spacing={"1rem"}
          padding={"2rem"}
        >
          <Typography textAlign={"center"}>{IncomingUser?.message}</Typography>
          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <IconButton sx={{
               
                backgroundColor:"red",
                color:"black",
                ":hover":{
                    backgroundColor:"red"
                }
            }}  onClick={callrejected}>
              <CallIcon />
            </IconButton>

            <IconButton sx={{
                backgroundColor:"green",
                color:"black",
                ":hover":{
                    backgroundColor:"green"
                }
            }} onClick={callaccepted}>
              <CallIcon />
            </IconButton>
          </Stack>
        </Stack>
      </motion.div>
    </Dialog>
  );
}
export default CallReceive;
