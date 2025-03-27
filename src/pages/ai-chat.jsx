'use client';

import { Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FileMenu from "../components/dialog/filemenu";
import AppLayout from "../components/layout/applayout";
import { TypingLoader } from "../components/layout/loaders";
import Messagecomponent from "../components/shared/messagecomponent";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { server } from "../constants/config";
import { friendMessages } from "../constants/suggestion";
import { getSocket } from "../socket";

 function AIChat() {
 const containerref = useRef(null);
   const bottomref = useRef(null);
   const socket = getSocket();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [message, setmessage] = useState("");
   const [messages, setmessages] = useState([]);
   const [allmessages,setallmessages]=useState([])
   const [page, setpage] = useState(1);
   const [FileMenuanchor, setisFileMenuanchor] = useState(null);
   const user = useSelector((state) => {
     return state.auth.user;
   });
   const [IamTyping, setIamTyping] = useState(false);
   const [UserTyping, setUserTyping] = useState(false);
   const typingTimeOut = useRef(null);
   const {chatId}=useParams()
   useEffect(() => {
     if (bottomref.current) {
       bottomref.current.scrollIntoView({
         behavior: "smooth",
       });
     }
   }, [allmessages]);
 
   
 
   
 
   
 
   const sendmessage = async(e) => {
     e.preventDefault();
    setallmessages(prev=>[...prev,{
        content: message,

        sender: {
          _id: user._id,
          name: user.name,
        },
        chatid: chatId,
        createdAt: new Date().toISOString(),
      }])
     try {
      setUserTyping(true)
        const response=await axios.post(`${server}/api/v1/chat/ai-chat`,
            {sessionId:chatId,prompt:message},{withCredentials:true})
          setUserTyping(false)
          
        response.data.sender={name:"ChatKaroAI",_id:"kjdksaldas"}
        
        
        setallmessages(prev=>[...prev,response.data])
     } catch (error) {
        console.log(error)
     }
     finally{
      setUserTyping(false)
     }
     //console.log(message);
   };
   
 
   
 
   const messagehandler=(e)=>{
    setmessage(e.target.value)
    
   }
   
 
   
 
   
   
 
   
 
   
   
   // useEffect(() => {
   //   socket.on(NEW_MESSAGE, );
 
   //   return () => {
   //     socket.off(NEW_MESSAGE, newMessageshandler);
   //   };
   // });
  
   
  

  return (
   <>
   <Stack
           direction={"row"}
           justifyContent={"right"}
           height={"8%"}
           marginRight={"9%"}
           marginTop={"1%"}
           gap={"5px"}
         >
           ChatKaroAI
           
         </Stack>
         
         <Stack
           ref={containerref}
           boxSizing={"border-box"}
           padding={"1rem"}
           spacing={"1rem"}
           height={"82%"}
           sx={{
             overflowY: "auto",
             overflowX: "hidden",
           }}
         >
           {allmessages &&
             allmessages.length > 0 &&
             allmessages.map((i, index) => (
               <Messagecomponent key={i._id || index} message={i} user={user} format={false}/>
             ))}
           {UserTyping && <TypingLoader />}
           <div ref={bottomref} />
         </Stack>
         <Stack
           direction={"row"}
           height={"10%"}
           maxHeight={"4rem"}
           gap={"0.7rem"}
           alignItems={"right"}
           marginRight={"0.5rem"}
         >
           <form
             style={{
               height: "100%",
               width: "20%",
             }}
             onSubmit={sendmessage}
           >
             <Stack direction={"row"} height={"100%"} padding={"1rem"}>
               
             </Stack>
             <FileMenu anchorE1={FileMenuanchor} chatId={chatId} />
           </form>
   
           <Stack width={"100%"}>
             <PlaceholdersAndVanishInput
               onChange={messagehandler}
               value={message}
               onSubmit={sendmessage}
               placeholders={friendMessages}
               setValue={setmessage}
             />
           </Stack>
         </Stack></>
  );
}
export default AppLayout()(AIChat);