import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  VideoCall as VideoCallIcon
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FileMenu from "../components/dialog/filemenu";
import AppLayout from "../components/layout/applayout";
import { TypingLoader } from "../components/layout/loaders";
import Messagecomponent from "../components/shared/messagecomponent";
import { Button } from "../components/ui/moving-borders";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import {
  ALERT,
  CALLING,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { friendMessages } from "../constants/suggestion";
import { useErrors, useSocketEvents } from "../hooks/hook";
import {
  useGetchatdetailsQuery,
  useGetoldmessagesQuery,
} from "../redux/api/api";
import { removeNewMessageAlert } from "../redux/reducers/chat";
import { setisCallingToSomeOne, setisFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";

function Chat({ chatId }) {
  const containerref = useRef(null);
  const bottomref = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const [page, setpage] = useState(1);
  const [FileMenuanchor, setisFileMenuanchor] = useState(null);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const [IamTyping, setIamTyping] = useState(false);
  const [UserTyping, setUserTyping] = useState(false);
  const typingTimeOut = useRef(null);

  useEffect(() => {
    if (bottomref.current) {
      bottomref.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, UserTyping]);

  const chatdetails = useGetchatdetailsQuery({ chatId });
  
  const oldmessageschunk = useGetoldmessagesQuery({ chatId, page });

  const { data: oldmessages, setData: setoldmessages } = useInfiniteScrollTop(
    containerref,
    oldmessageschunk?.data?.totalpages,
    page,
    setpage,
    oldmessageschunk?.data?.messages
  );

  const errors = [
    { isError: chatdetails.isError, error: chatdetails.error },
    { isError: oldmessageschunk.isError, error: oldmessageschunk.error },
  ];
  const members = chatdetails?.data?.chat?.members;
  
  const sendmessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, messages: message });
    setmessage("");
    //console.log(message);
  };
  const messagehandler = (e) => {
    setmessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }
    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);
    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 3000);
  };

  const startvideocall=()=>{
   
    const RoomId=uuidv4();
    socket.emit(CALLING,{UserId:user._id,ChatId:chatId,RoomId:RoomId.toString(),Name:user.name})
  }

  useEffect(() => {
    socket.emit(CHAT_JOINED,{userId:user._id,members})
    dispatch(removeNewMessageAlert(chatId));
    return () => {
      setmessage("");
      setmessages([]);
      setpage(1);
      setoldmessages([]);
      socket.emit(CHAT_LEAVED,{userId:user._id,members})
    };
  }, [chatId]);
  const handlefileopen = (e) => {
    dispatch(setisFileMenu(true));
    setisFileMenuanchor(e.currentTarget);
  };
  const newMessageshandler = useCallback(
    (data) => {
      
      if (data?.message?.chatid !== chatId) return;
      
      setmessages((prev) => {
        if (!prev.includes(data?.message)) return [...prev, data?.message];
      });
    },
    [chatId]
  );

  const starttypinghandlerlistner = useCallback(
    (data) => {
      if (data?.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );
  const stoptypinghandlerlistner = useCallback(
    (data) => {
      if (data?.chatId !== chatId) return;

      setUserTyping(false);
    },
    [chatId]
  );

  const alertlistener = useCallback(
    (data) => {
      if(data.chatId!==chatId) 
              return; 
      const messageforrealtime = {
        content:data.message,

        sender: {
          _id: "jsdkl",
          name: "Admin",
        },
        chatid: chatId,
        createdAt: new Date().toISOString(),
      };
      setmessages((prev) => [...prev, messageforrealtime]);
    },
    [chatId]
  );

  const callreceivedatbackend=useCallback((data)=>{
    const {RoomId,Forward}=data;
    if(Forward){
      dispatch(setisCallingToSomeOne(true))
      navigate(`/room/${RoomId}`)}
    else toast.error("Your Friend is Not Online")

  },[navigate])
  //Usecallback holds reference of a function
  const eventhandlers = {
    [ALERT]: alertlistener,
    [NEW_MESSAGE]: newMessageshandler,
    [START_TYPING]: starttypinghandlerlistner,
    [STOP_TYPING]: stoptypinghandlerlistner,
    [CALLING]:callreceivedatbackend
  };

  useSocketEvents(socket, eventhandlers);
  useErrors(errors);
  // useEffect(() => {
  //   socket.on(NEW_MESSAGE, );

  //   return () => {
  //     socket.off(NEW_MESSAGE, newMessageshandler);
  //   };
  // });
  const oldmessagesextracted = oldmessages || [];
  const allmessages = [...oldmessagesextracted, ...messages];
  
  useEffect(() => {
    if ( !chatdetails.isLoading && !chatdetails?.data?.chat) {
      
       navigate("/");}
  }, [chatdetails.data]);
  return chatdetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack direction={"row"} justifyContent={"right"} height={"7%"} marginRight={"9%"} marginTop={"1%"}>
        
          <Button onClick={startvideocall} disabled={chatdetails?.data?.chat?.groupchat ||false}>
          <VideoCallIcon/>  
          </Button>
        
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
            <Messagecomponent key={i._id} message={i} user={user} />
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
            <IconButton
              onClick={handlefileopen}
              sx={{ position: "relative", left: "1.5rem", rotate: "30deg" }}
            >
              <AttachFileIcon />
            </IconButton>
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
      </Stack>
      {/* <InputBox
            value={message}
            onChange={messagehandler}
            placeholder="Type a message here..."
            sx={{ bgcolor: "whitesmoke", height: "100%" }}
          />
          <IconButton
            type="submit"
            sx={{
              bgcolor: "#ea7070",
              color: "white",
              marginLeft: "1rem",
              padding: "1rem 0.5rem",
              ":hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
        <FileMenu anchorE1={FileMenuanchor} chatId={chatId} />
      </form> */}
    </>
  );
}
export default AppLayout()(Chat);
