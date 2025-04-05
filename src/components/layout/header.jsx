import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationIcon, Search as SearchIcon,Settings as SettingsIcon } from "@mui/icons-material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { lazy, Suspense } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { usernotExits } from "../../redux/reducers/auth";
import { resetnotification } from "../../redux/reducers/chat";
import { setisAllowSmartReply, setisMobileMenu, setisNewGroup, setisNotification, setisSearch } from "../../redux/reducers/misc";
import { server } from "../../constants/config";
import SmartReply from "../specific/allowSmartReply";
const Notification =lazy(()=>import ("../specific/notification")) ;
const NewGrp =lazy(()=>import("../specific/newGrp")) ;
const Search =lazy(()=>import ("../specific/search")) ;


const IconBtn = ({ title, Icon, onClick,value }) => {
 return ( <Tooltip title={title}>
    <IconButton color="inherit" size="large" onClick={onClick}>
      {
        value ?<Badge badgeContent={value} color="error"><Icon/></Badge>:<Icon />
      }
      
    </IconButton>
  </Tooltip>);
};
function Header() {
  const navigate = useNavigate();
  
  const {isSearch,isNotification,isNewGroup,isAllowSmartReply}=useSelector((state)=>state.misc)
  const {notificationcount}=useSelector((state)=>state.chat)
  
  
  const dispatch=useDispatch()
  const handlemobile = () => {
    dispatch(setisMobileMenu(true))
    
  };
  const openSearchDailog = () => {
    dispatch(setisSearch(true))
  };
  const openNewGroup = () => {
    dispatch(setisNewGroup(true))
  };
  const openNotification=()=>{
    dispatch(setisNotification(true))
    dispatch(resetnotification())
  }
  const openSmartReplyConsent=()=>{
    dispatch(setisAllowSmartReply(true))
  }
  const Logouthandler = () => {
    axios.post(`${server}/api/v1/user/logout`,{},{withCredentials: true }).then(({data})=>{
      dispatch(usernotExits())
      toast.success("Logout successfull")}).catch((error)=>{toast.error(error?.response?.data?.message ||"Something went wrong")})
  };
  const NavigatetoGrp = () => navigate("/groups");
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{ bgcolor: "orangered"}}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chatkaro
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handlemobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', gap: 2, width: '100%' }}>
              <Box>
                <IconBtn
                  title={"Search"}
                  onClick={openSearchDailog}
                  Icon={SearchIcon}
                />
                <IconBtn
                  title={"New Group"}
                  onClick={openNewGroup}
                  Icon={AddIcon}
                />
                <IconBtn
                  title={"Manage Group"}
                  onClick={NavigatetoGrp}
                  Icon={GroupIcon}
                />
                <IconBtn
                  title={"Notifications"}
                  onClick={openNotification}
                  Icon={NotificationIcon}
                  value={notificationcount}
                />
                <IconBtn
                  title={"Smart Reply"}
                  onClick={openSmartReplyConsent}
                  Icon={AutoAwesomeIcon}
                />
                <IconBtn
                  title={"Logout"}
                  onClick={Logouthandler}
                  Icon={LogoutIcon}
                />  
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && (
            <Suspense fallback={<Backdrop open/>}>
            <Search/>
            </Suspense>
        )
      }
        {
        isNotification && (
            <Suspense fallback={<Backdrop open/>}>
            <Notification/>
            </Suspense>
        )
      }
      {
        isNewGroup && (
            <Suspense fallback={<Backdrop open/>}>
            <NewGrp/>
            </Suspense>
        )
      }
      {
        isAllowSmartReply && (
          <Suspense fallback={<Backdrop open/>}>
            <SmartReply/>
            </Suspense>
        )
      }
    </>
  );
}

export default Header;
