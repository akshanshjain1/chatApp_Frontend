import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, IconButton, Stack, Typography } from "@mui/material";
import { Call as CallIcon, CallEnd as CallEndIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setisCallComing, setRingtonePlayed } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import { CALL_ACCEPTED, CALL_REJECTED } from "../../constants/events";
import { useNavigate } from "react-router-dom";
function CallReceive({
  IncomingUser,
  ringtoneRef,
  timerRef,
  hasUserInteracted,
  setHasUserInteracted,
}) {

  const navigate = useNavigate();
  const { isCallComing, ringtonePlayed } = useSelector((state) => state.misc);
  const calltype = IncomingUser?.type;

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();
  const callrejected = async () => {
    dispatch(setisCallComing(false));

    socket.emit(CALL_REJECTED, {
      UserId: IncomingUser.UserId,
      Name: user.name,
    });
  };
  const callaccepted = async () => {
    dispatch(setisCallComing(false));

    socket.emit(CALL_ACCEPTED, {
      UserId: IncomingUser.UserId,
      Name: user.name,
      CallReceivingUserId: user._id,
    });
    if (calltype === "video") navigate(`/room/${IncomingUser?.RoomId}`);
    else if (calltype === "voice")
      navigate(`/audioroom/${IncomingUser?.RoomId}`);
  };

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
          <Typography textAlign={"center"}>{`${IncomingUser?.type
            .toString()
            .toUpperCase()} Call`}</Typography>
          <Typography textAlign={"center"}>{IncomingUser?.message}</Typography>
          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <IconButton
              sx={{
                backgroundColor: "red",
                color: "black",
                ":hover": {
                  backgroundColor: "red",
                },
              }}
              onClick={callrejected}
            >
              <CallEndIcon />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: "green",
                color: "black",
                ":hover": {
                  backgroundColor: "green",
                },
              }}
              onClick={callaccepted}
            >
              <CallIcon />
            </IconButton>
          </Stack>
        </Stack>
      </motion.div>
    </Dialog>
  );
}
export default CallReceive;
