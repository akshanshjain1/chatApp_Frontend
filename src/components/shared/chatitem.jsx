import React, { memo } from "react";
import { Link } from "../styles/styledcomponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./avatarcard";
import {motion} from "framer-motion"
import { useParams } from "react-router-dom";
function ChatItem({
  avatar = [],
  name,
  _id,
  groupChat = false,
  samesender,
  isonline,
  newmessagealert,
  index = 0,
  handledeletechat,
}) {
  const { chatId } = useParams();

  return (
    <Link
    
      to={`/chat/${_id}`}
      onContextMenu={(e) => handledeletechat(e, _id, groupChat)}
    >
      <motion.div
      initial={{opacity:0, y:"-100%"}}
      whileInView={{opacity:1,y:0}}

        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: samesender ? "black" : "unset",
          color: samesender ? "white" : "unset",
          position: "relative",
        }}
      >
        <AvatarCard avatar={avatar}/>
        <Stack>
          <Typography>{name}</Typography>
          {newmessagealert && chatId!==_id &&   (
            <Typography>{newmessagealert.count} New Message</Typography>
          )}
        </Stack>
        {isonline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
}
export default memo(ChatItem);
