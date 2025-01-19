import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;
const admintabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/user-management",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chat",
    path: "/admin/chat-management",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/message-management",
    icon: <MessageIcon />,
  },
];


const Sidebar = ({ w = "100%" }) => {
  const dispatch=useDispatch()
  const logouthandler = () => {
    dispatch(adminLogout())
  };
  const location = useLocation();
  return (
    <Stack width={w} p={"3rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Admin
      </Typography>
      <Stack spacing={"1rem"}>
        {admintabs.map((i) => (
          <Link
            key={i.path}
            to={i.path}
            sx={
              location.pathname === i.path && {
                bgcolor: "#000000",
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {i.icon}
              <Typography>{i.name}</Typography>
            </Stack>
          </Link>
        ))}
        <Link onClick={logouthandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            
            <ExitToAppIcon />
            <Typography>{`Logout`}</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};
function AdminLayout({ children }) {
  const {isAdmin}=useSelector((state)=>state.auth)
  const [ismobile, setismobile] = useState(false);

  const handleClose = () => {
    setismobile(false);
  };
  const handlemobile = () => {
    setismobile((prev) => !prev);
  };
if(!isAdmin) return <Navigate to={'/admin'}/>
  return (
    <Grid container minHeight={"100%"}>
      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handlemobile}>
          {ismobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>
      <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: "lightgrey", height:'100%' }}>
        {children}
      </Grid>
      <Drawer open={ismobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
}
export default AdminLayout;
