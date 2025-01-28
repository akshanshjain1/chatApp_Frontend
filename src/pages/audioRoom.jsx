import {
  CallEnd as CallEndIcon,
  VolumeOff,
  VolumeUp,
  MicOffOutlined,
  MicOutlined,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AudioPlayer from "../components/specific/audioplayer";
import { LampDemo } from "../components/ui/lamp";
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
import Timer from "../components/specific/Timer";

function AudioRoom() {
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
  const [mute, setmute] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [micmute, setmicmute] = useState(false);

  const initiaizestream = useCallback(async () => {
    await navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1,
        },
      })
      .then((stream) => {
        setmystream(stream);

        peer.setlocalstream(stream);
      });
  });

  const handleonPlay = () => {
    setmute(false);
  };
  const sendStream = useCallback(() => {});
  const EndCall = () => {
    // Loop through each track and stop it

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
    if (peer.peer) {
      peer.peer.onicecandidate = function (event) {
        if (event.candidate) {
          let userid;
          if (user._id.toString() === IncomingUserId) userid = OutgoingUserId;
          else userid = IncomingUserId;
          setrefresh((prev) => !prev);
          socket.emit(ICE_CANDIDATE, { candidate: event.candidate, userid });
        }
      };
    }
  });

  useEffect(() => {
    if (peer.peer) {
      peer.peer.ontrack = function (event) {
        console.log("GOT streams");

        const stream = event.streams[0];
        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();
        console.log(audioTracks, videoTracks);
        setremotestream(event.streams[0]);
      };
    }
  }, []);

  useEffect(() => {
    if (remotestream) {
      setStartTime(Date.now());
    }
  }, [remotestream]);
  let toggleSpeaker = async () => {
    setmute((prev) => !prev);
    let audioTrack = remotestream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
    } else {
      audioTrack.enabled = true;
    }
  };

  let toggleMic = () => {
    setmicmute((prev) => !mystream.muted);
    mystream.muted = !mystream.muted;
    const audioTrack = mystream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
    peer.replaceTrack(
      mystream.getTracks().find((track) => track.kind === "audio"),
      audioTrack,
      mystream
    );
  };
  return !callstarted ? (
    <LampDemo />
  ) : (
    <Stack
      direction="column"
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
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
          background:
            "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1, #fad0c4)",
          backgroundSize: "200% 200%",
          animation: "gradientBackground 12s ease infinite",
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

      {remotestream && (
        <motion.div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {startTime && <Timer startTime={startTime} />}

          <AudioPlayer mediaStream={remotestream} mute={mute} />
        </motion.div>
      )}

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
            onClick={toggleSpeaker}
          >
            <IconButton sx={{ color: "white" }}>
              {mute ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </motion.div>
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
            onClick={toggleMic}
          >
            <IconButton sx={{ color: "white" }}>
              {mystream?.muted ? <MicOffOutlined /> : <MicOutlined />}
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
export default AudioRoom;
