import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightblue } from "../../constants/color";
import moment from "moment";
import { fileformat } from "../../libs/features";
import RenderAttachment from "./renderattachment";
import {motion} from "framer-motion"
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
const MessageComponent = ({ message, user,format=true }) => {
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
    {content && (
  <Typography
    sx={{
      wordWrap: "break-word",
      overflowWrap: "break-word",
      whiteSpace: "pre-wrap",
      fontSize: "clamp(12px, 2vw, 16px)", // Responsive font size
    }}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown (bold, tables, lists, etc.)
      rehypePlugins={[rehypeRaw]}  // Allows raw HTML inside Markdown
      components={{
        strong: ({ children }) => <strong style={{ fontWeight: "bold" }}>{children}</strong>,
        em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
        code: ({ inline, children }) =>
          inline ? (
            <Typography
              component="span"
              sx={{
                bgcolor: "#f5f5f5",
                px: 0.5,
                borderRadius: 1,
                fontSize: "clamp(12px, 1.8vw, 15px)",
                fontFamily: "monospace",
              }}
            >
              {children}
            </Typography>
          ) : (
            <Typography
              component="pre"
              sx={{
                bgcolor: "#f5f5f5",
                p: 1,
                borderRadius: 1,
                overflowX: "auto",
                fontSize: "clamp(12px, 1.6vw, 14px)",
                fontFamily: "monospace",
              }}
            >
              {children}
            </Typography>
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  </Typography>
)}
      {attachments.length >0 && (
        attachments.map((i,index)=>{
            let url;
            let file;
            if(format===false){
              url=i;
            }
            else{
              url=i.url
              file=fileformat(url);
            }
          
            
            return (
                <Box key={index}>
                    <a href={url} target="_blank" download style={{color:'black'}}>
                    {format?<RenderAttachment file={file} url={url}/>:(<img src={url} alt="Attachment" width={'200px'} height={'150px'} style={{
            objectFit:'contain'
        }}/>)}
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
