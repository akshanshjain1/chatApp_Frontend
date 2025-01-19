import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightblue } from "../../constants/color";
import moment from "moment";
import { fileformat } from "../../libs/features";
import RenderAttachment from "./renderattachment";
import {motion} from "framer-motion"
const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments=[], createdAt } = message;
 
  const samesender = sender?._id === user?._id;
  const timeago=moment(createdAt).fromNow()
  return (
    <motion.div 
    initial={{opacity:0, x:"-100%"}}
      whileInView={{opacity:1,x:0}}
      style={{
        alignSelf: samesender ? "flex-end" : "flex-start",
        backgroundColor: "whitesmoke",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
        maxWidth:"70%",
        
      }}
    >
      {!samesender && (
        <Typography color={lightblue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}
     {content && <Typography sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>{content}</Typography>}
      {attachments.length >0 && (
        attachments.map((i,index)=>{
            const url=i.url
            
            const file=fileformat(url);
            
            return (
                <Box key={index}>
                    <a href={url} target="_blank" download style={{color:'black'}}>
                    <RenderAttachment file={file} url={url}/>
                    </a>
                </Box>
            )

        })
      )}
      <Typography variant="caption" color={'text.secondry'}>{timeago}</Typography>
    </motion.div>
  );
};
export default memo(MessageComponent);
