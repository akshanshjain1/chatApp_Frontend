import {
  CallEnd as CallEndIcon,
  VolumeOff as MuteIcon,
  VolumeUp as UnMuteIcon,
} from "@mui/icons-material";
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
  TAKE_OFFER,
} from "../constants/events";
import { useSocketEvents } from "../hooks/hook";
import { setisCallingToSomeOne } from "../redux/reducers/misc";
import peer from "../services/peer";
import { getSocket } from "../socket";
import AudioPlayer from "../components/specific/audioplayer";

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
  const [refresh, setrefresh] = useState(false);
  const [mute, setmute] = useState(true);
  const [mystreamurl, setmystreamurl] = useState();
  const [remotestreamurl, setremotestreamurl] = useState();
  const initiaizestream = useCallback(async () => {
    await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        console.log(stream);
        setmystream(stream);
        peer.setlocalstream(stream);
        console.log("local stream set");
      });
  });

  const handleonPlay = () => {
    setmute(false);
  };
  const sendStream = useCallback(() => {
   
  });
  const EndCall = () => {
    // Loop through each track and stop it

    peer.peer.close();
    let userid;
    if (user._id.toString() === IncomingUserId) userid = OutgoingUserId;
    else userid = IncomingUserId;

    socket.emit(CALL_CUT, { CallcutUserid: userid, RoomId });
    mystream.getTracks().forEach((track) => track.stop());
    setmystream("");
    toast.success("CALL ENDED");
    navigate("/");
  };
  const callrejected = useCallback(
    ({ UserId, message }) => {
      if (UserId.toString() !== user._id.toString()) return;
      toast.error(message);

      navigate("/");
    },
    [RoomId]
  );

  const callcut = async ({ CallcutUserid, Roomid }) => {
    if (RoomId !== Roomid) return;
    if (CallcutUserid.toString() !== user._id.toString()) return;

    console.log(peer.peer.getLocalStreams());
    peer.peer.close();

    mystream.getTracks().forEach((track) => track.stop());
    toast.success("Call Cut by Your Friend");
    navigate("/");
  };
  const callaccepted = useCallback(
    async ({ UserId, message, CallReceivingUserId }) => {
      if (UserId.toString() !== user._id.toString()) return;
      setOutgoingUserId(UserId.toString());
      setIncomingUserId(CallReceivingUserId.toString());
      dispatch(setisCallingToSomeOne(false));
      await initiaizestream();
      toast.success(message);
      setcallstarted(true);

      const offer = await peer.getOffer();
      socket.emit(TAKE_OFFER, { UserId, CallReceivingUserId, offer });
    },
    [socket]
  );
  const offersendbycallerhandler = useCallback(
    async ({ UserId, CallReceivingUserId, offer }) => {
      if (CallReceivingUserId.toString() !== user._id.toString()) return;
      await initiaizestream();
      setOutgoingUserId(UserId);
      setIncomingUserId(CallReceivingUserId);

      // set remote description;
      setcallstarted(true);

      const ans = await peer.getAnswer(offer);

      socket.emit(OFFER_ACCEPTED, { UserId, CallReceivingUserId, ans });
    },
    [socket]
  );

  const offeracceptedhandler = useCallback(
    async ({ UserId, CallReceivingUserId, ans }) => {
      await peer.setLocalDescription(ans);
    },
    [socket]
  );

  const handleicecandidate = useCallback(
    async ({ candidate, userid }) => {
      await peer.setIceCandidate(candidate);
      setrefresh((prev) => !prev);
      setcallstarted(true);
    },
    [socket]
  );
 

  const eventhandlers = {
    [CALL_REJECTED]: callrejected,
    [CALL_ACCEPTED]: callaccepted,
    [TAKE_OFFER]: offersendbycallerhandler,
    [OFFER_ACCEPTED]: offeracceptedhandler,
    [CALL_CUT]: callcut,
    [ICE_CANDIDATE]: handleicecandidate,
  };

  useSocketEvents(socket, eventhandlers);

  useEffect(() => {
    peer.peer.onicecandidate = function (event) {
      if (event.candidate) {
        let userid;
        if (user._id.toString() === IncomingUserId) userid = OutgoingUserId;
        else userid = IncomingUserId;
        setrefresh((prev) => !prev);
        socket.emit(ICE_CANDIDATE, { candidate: event.candidate, userid });
      }
    };
  });

  useEffect(() => {
    peer.peer.ontrack = function (event) {
      console.log("GOT streams");
     
      setremotestream(event.streams[0]);
    };
  }, [refresh]);

  return !callstarted ? (
    <CoverDemo />
  ) : (
    
      <Stack direction={"column"}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            background: "radial-gradient(circle, #0f2027, #203a43, #2c5364)",
          }}
        >
          {remotestream && (
            <ReactPlayer
              playing
             
              height="80vh" // 60% of the viewport height
              width="80vw" // 60% of the viewport width
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: -10000,
                
                
                borderRadius: "1rem", // Optional: Adjust zIndex if needed
              }}
              url={remotestream}
            />
          )}
  
          {mystream && (
            <motion.div
              animate={{
                width: isCallingToSomeOne ? "70%" : "35%",
                height: isCallingToSomeOne ? "70%" : "35%",
                bottom: !isCallingToSomeOne ? "0" : "auto",
                right: !isCallingToSomeOne ? "0" : "auto",
                top: !isCallingToSomeOne ? "auto" : "50%",
                left: !isCallingToSomeOne ? "auto" : "50%",
                transform: !isCallingToSomeOne ? "none" : "translate(-50%, -50%)",
              }}
              initial={false}
              transition={{
                duration: 0.5, // Smooth transition duration
                ease: "easeInOut", // Animation easing
              }}
              style={{
                position: !isCallingToSomeOne ? "fixed" : "absolute",
                
                borderRadius: "1rem",
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              <ReactPlayer
                playing
                
                width="100%"
                height="100%"
                url={mystream}
              />
            </motion.div>
          )}
          {/* { isCallingToSomeOne && <GlobeDemo/>} */}
        </motion.div>
  
        {callstarted && (
          <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={"1.5rem"} style={{position: "fixed",
            bottom: "2rem",
            left:"46%"
            }}>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                
                padding: "10px 10px",
                backgroundColor:"red",
                
                color: "black",
                fontSize: "8px",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              }}
              onClick={EndCall}
            >
              <IconButton sx={{
                color:"black "
              }}>
                <CallEndIcon />
              </IconButton>
            </motion.div>
          </Stack>
        )}
      </Stack>
    
  );
}
export default Room;
