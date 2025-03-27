'use client';

import { Stack } from "@mui/material";
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
      direction="row"
      justifyContent="left"
      alignItems="center"
      height="8vh"
      className="relative px-6 py-3 w-full bg-black shadow-lg overflow-hidden"
      style={{ background: "none" }}
    >
      {/* Background Animated Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="h-full w-full animate-moving-lines opacity-40 mix-blend-overlay"></div>
      </div>

      {/* Logo */}
      <img
        src="/ChatKaroAIProfilePhoto.webp"
        alt="ChatKaroAI Logo"
        className="h-[calc(8vh*0.75)] w-[calc(8vh*0.75)] rounded-full object-cover shadow-lg border border-cyan-400 relative z-1000"
      />

      {/* Brand Name with Futuristic Effect */}
      <span className="ml-3 text-[1.1rem] md:text-[1.3rem] lg:text-[1.5rem] font-semibold tracking-wide text-cyan-300 relative z-1000 font-tech">
        ChatKaroAI
      </span>

      {/* CSS for Animated Lines & Futuristic Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');

          .font-tech {
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
          }

          @keyframes moving-lines {
            0% { background-position: 0 0; }
            100% { background-position: 200% 200%; }
          }

          .animate-moving-lines {
            background: repeating-linear-gradient(
              135deg,
              rgba(0, 255, 255, 0.2) 0px,
              rgba(0, 255, 255, 0.1) 10px,
              transparent 20px
            );
            background-size: 300% 300%;
            animation: moving-lines 6s linear infinite;
          }
        `}
      </style>
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