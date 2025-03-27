import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import Chatitem from "../shared/chatitem";
import { gradient } from "../../constants/color";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import {motion} from "framer-motion"
import AvatarCard from "../shared/avatarcard";
function ChatList({
  w = "100%",
  chats = [],
  chatId,
  onlineusers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handledeletechat,
}) {
  const chatkaroAiId = uuidv4();
  return (
    <Stack width={w} overflow={'auto'} height={'100%'} sx={{background:`${gradient}`}}>
   
      <Link
          
            to={`/ai-chat/${chatkaroAiId}`}
            
          >
            <motion.div
            initial={{opacity:0, y:"-100%"}}
            whileInView={{opacity:1,y:0}}
      
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: true ? "black" : "unset",
                color: true ? "white" : "unset",
                position: "relative",
              }}
            >
              <AvatarCard avatar={["/ChatKaroAIProfilePhoto.webp"]}/>
              <Stack>
                <Typography>{"Chatkaro AI"}</Typography>
                
              </Stack>
              {true && (
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
      {chats?.map((data, index) => {
        
        const { avatar, name, _id, groupchat, members } = data;
        
        const newmessagealert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );
        const isonline = members?.some((member) => onlineusers.includes(member));

        return (
          <Chatitem
            newmessagealert={newmessagealert}
            isonline={isonline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupchat}
            samesender={chatId === _id}
            handledeletechat={(e)=>handledeletechat(e,_id,groupchat)}
            index={index}
          />
        );
      })}
    </Stack>
  );
}
export default ChatList;
