import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FileMenu from "../components/dialog/filemenu";
import AppLayout from "../components/layout/applayout";
import { TypingLoader } from "../components/layout/loaders";
import Messagecomponent from "../components/shared/messagecomponent";
import LiveLocationButton from "../components/specific/livelocationbutton";
import { Button } from "../components/ui/moving-borders";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import {
  ALERT,
  CALLING,
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
import {
  setisCallingToSomeOne,
  setisFileMenu,
  setisShowSmartReply,
} from "../redux/reducers/misc";
import { getSocket } from "../socket";
import axios from "axios";
import { server } from "../constants/config";
import SmartReplyBox from "../components/specific/smartreplybox";

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
  const [smartReplies, setsmartReplies] = useState(null);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const { isShowSmartReply } = useSelector((state) => state.misc);
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

  const GetSmartReply = async () => {
    const sensitiveIdentifiers = [
      // Passwords, PINs, OTPs, CVVs, etc. with typo tolerance and cross-line flexibility
      /\b(p(?:a|@)?ss(?:w(?:o|0)?rd|wrd|code)?|p[a@]ss|pin(?:\s*number)?|cvv|cvc|otp|auth(?:entication)?\s*code|security\s*code|token|access\s*key|secret\s*key)\s*[:=]?\s*[\n\r\s]*["']?[\w\d!@#$%^&*()\-+=]{3,40}["']?\b/i,
    
      // National IDs and banking numbers: DL, PAN, Aadhaar, SSN, IFSC, UPI, etc.
      /\b(?:driv(?:ing|in|n)?\s*licen[cs]e|dl\s*no|passp(?:ort|rt)|p[a@]n|aad+haar|ssn|national\s*id|govt\s*id|voter\s*id|id\s*(?:no|number)?|account\s*number|iban|ifsc|upi)\s*[:=]?\s*[\n\r\s]*["']?[\w\d\-\/]{4,40}["']?\b/i,
    
      // Credit/debit card numbers — supports multiline and separators
      /\b(?:credit|debit)?\s*card\s*(?:no|number)?\s*[:=]?\s*[\n\r\s]*["']?\d{4,}([-\s]?\d{4,}){0,3}["']?\b/i,
    
      // API keys, auth tokens, session IDs — supports multiline
      /\b(?:api[\s_-]*key|session[\s_-]*id|auth[\s_-]*token|secret[\s_-]*key|access[\s_-]*key)\s*[:=]?\s*[\n\r\s]*["']?[\w\-]{8,100}["']?\b/i,
    
      // US Social Security Number (SSN)
      /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/,
    
      // Aadhaar (India): 12-digit format
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
    
      // PAN (India): 5 letters + 4 digits + 1 letter
      /\b[A-Z]{5}[0-9]{4}[A-Z]\b/i,
    
      // UPI ID: name@bank format
      /\b[\w.\-]{2,30}@[a-z]{2,20}\b/i,
    
      // Generic sensitive keys/tokens
      /\b(?:key|token|credential|password|secret)\s*[:=]?\s*[\n\r\s]*["']?[\w\-]{10,100}["']?\b/i,
    ];
    
    

    if (!user.allowAutoReply) {
      toast.error("Enable Smart Reply to Get Smart Reply");
      return;
    }

    const conversations = allmessages
      .slice(-15)
      .map((conversation) => ({
        message: conversation.content,
        sender: conversation.sender.name,
      }));
      
    const containsSensitiveInfo = conversations.some(({message}) =>
      sensitiveIdentifiers.some((pattern) => pattern.test(message))
    );
    
    if (containsSensitiveInfo) {
      toast.error(
        "Some Confedential details may be present in last 15 message.\nSmart Reply Cannot be generated");
      return;
    }
    dispatch(setisShowSmartReply(true));
    const { data } = await axios.post(
      `${server}/api/v1/chat/getSmartReply`,
      { conversations, sendername: user.name },
      { withCredentials: true }
    );

    setsmartReplies(data.smartReply);
  };

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

  const startvideocall = () => {
    const RoomId = uuidv4();
    socket.emit(CALLING, {
      UserId: user._id,
      ChatId: chatId,
      RoomId: RoomId.toString(),
      Name: user.name,
      type: "video",
    });
  };
  const startaudiocall = () => {
    const RoomId = uuidv4();
    socket.emit(CALLING, {
      UserId: user._id,
      ChatId: chatId,
      RoomId: RoomId.toString(),
      Name: user.name,
      type: "voice",
    });
  };

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));
    return () => {
      setmessage("");
      setmessages([]);
      setpage(1);
      setoldmessages([]);
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
      if (data.chatId !== chatId) return;
      const messageforrealtime = {
        content: data.message,

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

  const callreceivedatbackend = useCallback(
    (data) => {
      const { RoomId, Forward, type } = data;
      if (Forward) {
        dispatch(setisCallingToSomeOne(true));
        if (type === "video") navigate(`/room/${RoomId}`);
        else if (type === "voice") navigate(`/audioroom/${RoomId}`);
      } else toast.error("Your Friend is Not Online");
    },
    [navigate]
  );

  //Usecallback holds reference of a function
  const eventhandlers = {
    [ALERT]: alertlistener,
    [NEW_MESSAGE]: newMessageshandler,
    [START_TYPING]: starttypinghandlerlistner,
    [STOP_TYPING]: stoptypinghandlerlistner,
    [CALLING]: callreceivedatbackend,
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
    if (!chatdetails.isLoading && !chatdetails?.data?.chat) {
      navigate("/");
    }
  }, [chatdetails.data]);
  return chatdetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        direction={"row"}
        justifyContent={"right"}
        height={"7%"}
        marginRight={"9%"}
        marginTop={"1%"}
        gap={"5px"}
      >
        <LiveLocationButton
          disabled={chatdetails?.data?.chat?.groupchat || false}
          chatId={chatId}
        />
        <Button
          onClick={startaudiocall}
          disabled={chatdetails?.data?.chat?.groupchat || false}
        >
          <PhoneIcon />
        </Button>
        <Button
          onClick={startvideocall}
          disabled={chatdetails?.data?.chat?.groupchat || false}
        >
          <VideoCallIcon />
        </Button>
      </Stack>
      <Stack
        height={"8%"}
        sx={{ alignItems: "center", justifyContent: "center" }}
      >
        <Typography
          style={{ color: "#4CAF50", fontWeight: "bold", textAlign: "center" }}
        >
          Messages are securely sent with end-to-end encryption.
        </Typography>
      </Stack>
      <Stack
        ref={containerref}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        height={"74%"}
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {allmessages &&
          allmessages.length > 0 &&
          allmessages.map((i, index) => (
            <Messagecomponent key={i._id || index} message={i} user={user} />
          ))}
        {UserTyping && <TypingLoader />}
        <div ref={bottomref} />
      </Stack>
      {isShowSmartReply && (
        <SmartReplyBox replies={smartReplies} setmessage={setmessage} />
      )}
      <Stack
        direction={"row"}
        height={"10%"}
        maxHeight={"4rem"}
        gap={"0.3%"}
        alignItems={"center"}
        justifyContent={"center"}
        marginRight={"0.3%"}
      >
        <form
          style={{
            height: "100%",
            width: "20%",
          }}
          onSubmit={sendmessage}
        >
          <Stack direction={"row"} height={"100%"} padding={"0.2%"}>
            <IconButton
              onClick={handlefileopen}
              sx={{
                position: "relative",
                left: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "3rem",
                  lg: "5rem",
                },
                rotate: "30deg",
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </Stack>
          <FileMenu anchorE1={FileMenuanchor} chatId={chatId} />
        </form>

        <Stack width={"70%"}>
          <PlaceholdersAndVanishInput
            onChange={messagehandler}
            value={message}
            onSubmit={sendmessage}
            placeholders={friendMessages}
            setValue={setmessage}
          />
        </Stack>
        <Stack
          height="100%"
          width="15%"
          justifyContent="center"
          alignItems="center"
        >
          <Tooltip title="Get Smart Reply" arrow>
            <IconButton
              sx={{
                background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
                borderRadius: "50%",
                width: {
                  xs:"90%",
                  sm:"80%",
                  md:"80%",
                  lg:"80%"
                },
                height: "100%",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1) rotate(8deg)",
                  boxShadow: "0 6px 25px rgba(0, 0, 0, 0.2)",
                },
              }}
              onClick={GetSmartReply}
            >
              <AutoAwesomeIcon color="primary" sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>
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
