import { CallEnd as CallEndIcon, VolumeOff as MuteIcon, VolumeUp as UnMuteIcon } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CoverDemo } from "../components/specific/callpreloader";
import {
  CALL_ACCEPTED,
  CALL_CUT,
  CALL_REJECTED,
  ICE_CANDIDATE,
  OFFER_ACCEPTED,
  TAKE_OFFER
} from "../constants/events";
import { useSocketEvents } from "../hooks/hook";
import { setisCallingToSomeOne } from "../redux/reducers/misc";
import peer from "../services/peer";
import { getSocket } from "../socket";




function Room() {
  const socket = getSocket();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { RoomId } = useParams();
  const [OutgoingUserId, setOutgoingUserId] = useState("");
  const [IncomingUserId, setIncomingUserId] = useState("");
  const dispatch = useDispatch();
  const { isCallingToSomeOne } = useSelector((state) => state.misc);
  const [mystream, setmystream] = useState();
  const [remotestream, setremotestream] = useState();
  const [callstarted, setcallstarted] = useState(false);
  const [refresh,setrefresh]=useState(false)
  const[mute,setmute]=useState(false)
  
  const initiaizestream = useCallback( async() => {
   
   await   navigator.mediaDevices.getUserMedia({
      audio: true,  
      video: {
        width:{max:640,min:640},
        height:{max:360,min:360}
      },
    }).then((stream)=>{
      console.log(stream)
      setmystream(stream);
      peer.setlocalstream(stream)
      console.log("local stream set")
    });
    ;
  })
  const sendStream=useCallback(()=>{
    peer.setlocalstream(mystream)
  })
  const EndCall=()=>{
   

    // Loop through each track and stop it

        peer.peer.close();
        let userid;
                       if(user._id.toString()===IncomingUserId)
                         userid=OutgoingUserId;
                       else userid=IncomingUserId;
                       
        socket.emit(CALL_CUT,{CallcutUserid:userid,RoomId});
        mystream.getTracks().forEach((track) => track.stop());
        setmystream("")
        toast.success("CALL ENDED");
        navigate("/")
        
  }
  const callrejected = useCallback(
    ({ UserId, message }) => {
      if (UserId.toString() !== user._id.toString()) return;
      toast.error(message);
     
      navigate("/");
    },
    [RoomId]
  );

  const callcut=async({CallcutUserid,Roomid})=>{
    if(RoomId!==Roomid)
        return ;
      if(CallcutUserid.toString()!==user._id.toString())
          return ;
        
      console.log(peer.peer.getLocalStreams())
      peer.peer.close();
      
        
      
       
       mystream.getTracks().forEach((track) => track.stop());
      toast.success("Call Cut by Your Friend")
      navigate("/")


  }
  const callaccepted = useCallback(
    async ({ UserId, message, CallReceivingUserId }) => {
      if (UserId.toString() !== user._id.toString()) return;
      setOutgoingUserId(UserId.toString());
      setIncomingUserId(CallReceivingUserId.toString());
      dispatch(setisCallingToSomeOne(false));
      await initiaizestream()
      toast.success(message);
      setcallstarted(true)
    
      const offer = await peer.getOffer()
      socket.emit(TAKE_OFFER, { UserId, CallReceivingUserId, offer});
    },
    [socket]
  );
  const offersendbycallerhandler = useCallback(
    async ({ UserId, CallReceivingUserId, offer }) => {
      if (CallReceivingUserId.toString() !== user._id.toString()) return;
      await initiaizestream()
      setOutgoingUserId(UserId)
      setIncomingUserId(CallReceivingUserId)
     
      // set remote description;
      setcallstarted(true)
      
      const ans=await peer.getAnswer(offer)
      
      socket.emit(OFFER_ACCEPTED, { UserId, CallReceivingUserId, ans });
    },
    [socket]
  );

  

  

  
  const offeracceptedhandler = useCallback(
   async  ({ UserId, CallReceivingUserId, ans }) => {
        
        await peer.setLocalDescription(ans)
     
    },
    [socket]
  );

 

    const handleicecandidate=useCallback(async({candidate,userid})=>{
            
            
            await peer.setIceCandidate(candidate)
            setrefresh(prev=>!prev)
            setcallstarted(true)
    },[socket])
  const handleCallCut=useCallback(async({CallcutUserid,Roomid})=>{
   
      if(Roomid!==RoomId)
          return ;
      if(CallcutUserid.toString()!==user._id.toString())
          return ;
      if (mystream) {
        mystream.getTracks().forEach(track => track.stop());
      } 
     
      toast.success("Call Ended By Your Friend")
     
      navigate("/")    
  },[RoomId])

  const eventhandlers = {
    [CALL_REJECTED]: callrejected,
    [CALL_ACCEPTED]: callaccepted,
    [TAKE_OFFER]: offersendbycallerhandler,
    [OFFER_ACCEPTED]: offeracceptedhandler,
    [CALL_CUT]:callcut,
    [ICE_CANDIDATE]:handleicecandidate
  };

  useSocketEvents(socket, eventhandlers);

  

  useEffect(()=>{
    peer.peer.onicecandidate=function(event){
      if(event.candidate){
        let userid;
        if(user._id.toString()===IncomingUserId)
          userid=OutgoingUserId;
        else userid=IncomingUserId
        setrefresh((prev)=>!prev)
        socket.emit(ICE_CANDIDATE,{candidate:event.candidate,userid})
      }
  }


  })


 useEffect(()=>{
  peer.peer.ontrack=function(event){
    console.log("GOT streams")
    setremotestream(event.streams[0])
  }
 },[refresh])



  return !callstarted?<CoverDemo/> : (
    <Stack direction="column" sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1, #fad0c4)", // Beautiful pastel tones
        backgroundSize: "200% 200%",
        animation: "gradientBackground 12s ease infinite", // Smooth background animation
      }}
    />
  
    
    <style>
      {`
        @keyframes gradientBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}
    </style>
  
    
    {mystream && (
      <motion.div
        animate={{
          width: remotestream ? "20%" : "100%",
          height: remotestream ? "20%" : "100%",
          bottom: remotestream ? "1rem" : "auto",
          right: remotestream ? "1rem" : "auto",
          top: remotestream ? "auto" : "50%",
          left: remotestream ? "auto" : "50%",
          transform: remotestream ? "none" : "translate(-50%, -50%)",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: remotestream ? "fixed" : "absolute",
          borderRadius: "1rem",
          overflow: "hidden",
          zIndex: remotestream ? 10 : 1,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.5)",
          border: "4px solid rgba(255, 255, 255, 0.3)", 
        }}
      >
        <ReactPlayer
          playing
          muted
          width="100%"
          height="100%"
          url={mystream}
          style={{ borderRadius: "1rem" }}
        />
      </motion.div>
    )}
  
  
    {remotestream && (
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "85%",
          height: "85%",
          transform: "translate(-50%, -50%)",
          borderRadius: "1rem",
          overflow: "hidden",
          zIndex: 5,
          boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.7)",
          border: "5px solid rgba(255, 255, 255, 0.4)", 
        }}
      >
        <ReactPlayer
          playing
         
          height="100%"
          url={remotestream}
          style={{ borderRadius: "1rem" }}
        />
      </motion.div>
    )}
  
    {/* Call Controls */}
    {callstarted && (
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        spacing="2rem"
        sx={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
      >
          <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "10px",
            backgroundColor: "gray",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
          onClick={()=>{
            
            setmute(prev=>!prev)}}
        >
          <IconButton sx={{ color: "white" }}>
            {mute ? <MuteIcon/> : <UnMuteIcon/>}
          </IconButton>
        </motion.div>
       
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "10px",
            backgroundColor: "red",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
          onClick={EndCall}
        >
          <IconButton sx={{ color: "white" }}>
            <CallEndIcon />
          </IconButton>
        </motion.div>
      </Stack>
    )}
  </Stack>
  

  
  );
}
export default Room;