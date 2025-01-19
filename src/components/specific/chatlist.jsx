import { Stack } from "@mui/material";
import React from "react";
import Chatitem from "../shared/chatitem";
import { gradient } from "../../constants/color";
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
  
  return (
    <Stack width={w} overflow={'auto'} height={'100%'} sx={{background:`${gradient}`}}>
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
