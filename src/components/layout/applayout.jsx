import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Title from "../shared/title";
import ChatList from "../specific/chatlist";
import Header from "./header";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGES_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
  SOMEONE_CALLING,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getorsavefromstorage } from "../../libs/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  increamentnotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setisCallComing,
  setisDeleteMenu,
  setisMobileMenu,
  
  setselectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialog/deletechatmenu";
import Profile from "../specific/profile";
import CallReceive from "../dialog/callreceivedialog";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const { chatId } = useParams();
    const dispatch = useDispatch();
    const deletemenuanchor = useRef(null);
    const ringtoneRef = useRef(null);
    const notificationRef = useRef(null);
    const timerRef=useRef(0)
  
    const { isMobileMenu, isCallComing } = useSelector((state) => state.misc);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [onlineusers, setonlineusers] = useState([]);
    const [IncomingCallUserData, setIncomingCallUserData] = useState(null);
    
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    const socket = getSocket();
    const navigate = useNavigate();
    const [hasUserInteracted, setHasUserInteracted] = useState(true);
    
    const newMessagesalerthandler = useCallback(async (data) => {
    
      if (data?.chatId === chatId) return;
     
      
      dispatch(setNewMessagesAlert(data));
    }, [chatId]);
    const newrequestalert = useCallback(async () => {
      if (!hasUserInteracted) {
        
        return;
      }
      if (!notificationRef.current) {
        
        notificationRef.current = new Audio(
          "../../../notification-sound.mp3"
        );
      }

      notificationRef.current.play();
      dispatch(increamentnotification());
    }, [chatId, hasUserInteracted]);

    const refetchlistner = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineuserslistner = useCallback(
      async (data) => {
        setonlineusers(data);
      },
      [chatId]
    );

    const callreceivehandler = useCallback(
      (data) => {
        const { ReceivingUserId, message } = data;
        if (ReceivingUserId.toString() !== user._id.toString()) return;
        setIncomingCallUserData(data);
        dispatch(setisCallComing(true));
      },


      
      [chatId, hasUserInteracted]
    );
    const eventhandlers = {
      [NEW_MESSAGES_ALERT]: newMessagesalerthandler,
      [NEW_REQUEST]: newrequestalert,
      [REFETCH_CHATS]: refetchlistner,
      [ONLINE_USERS]: onlineuserslistner,
      [SOMEONE_CALLING]: callreceivehandler,
    };

    useSocketEvents(socket, eventhandlers);

    useErrors([{ isError, error }]);

    useEffect(() => {
      getorsavefromstorage({
        key: NEW_MESSAGES_ALERT,
        value: newMessagesAlert,
      });
    }, [newMessagesAlert]);
    const handledeletechat = (e, _id, groupChat) => {
      
      deletemenuanchor.current = e.currentTarget;
      dispatch(setisDeleteMenu(true));
      dispatch(setselectedDeleteChat({ chatId: _id.toString(), groupChat }));
    };
    const handleMobileClose = () => dispatch(setisMobileMenu(false));

      useEffect(()=>{
        return()=>{
        
          timerRef.current=null;
          ringtoneRef.current=null;
          setHasUserInteracted(true);
        }
      })
    
   
    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteOptionAnchor={deletemenuanchor}
        />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenu} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handledeletechat={handledeletechat}
              newMessagesAlert={newMessagesAlert}
              onlineusers={onlineusers}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handledeletechat={handledeletechat}
                newMessagesAlert={newMessagesAlert}
                onlineusers={onlineusers}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            {isCallComing && (
              <CallReceive
                IncomingUser={IncomingCallUserData}
                ringtoneRef={ringtoneRef}
                timerRef={timerRef}
                hasUserInteracted={hasUserInteracted}
                setHasUserInteracted={setHasUserInteracted}
                
              />
            )}
            <WrappedComponent {...props} chatId={chatId} />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(2, 1, 1, 0.85)",
            }}
          >
            {" "}
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
