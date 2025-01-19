import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import AdminLayout from "../components/layout/adminlayout";
import Loaders from "../components/layout/loaders";
import { DougnutChart, LineChart } from "../components/specific/charts";
import {
  CurveButton,
  SearchField,
} from "../components/styles/styledcomponents";
import { useErrors } from "../hooks/hook";

import { useAdminstatsQuery } from "../redux/api/api";

function AdminDashBoard() {

  const {data,isLoading,isError,error}=useAdminstatsQuery()
 
  useErrors([{
    isError,error
  }])
  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "3rem 0", borderRadius: "1rem" }}
    >
      <Stack direction={"row"} sx={{ alignItem: "center" }} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
        <SearchField placeholder="Search..." />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          color={"rgba(0,0,0,0.7)"}
          textAlign={"center"}
        >
          {moment().format("MMMM Do YYYY")}
        </Typography>
        <NotificationsIcon />
      </Stack>
    </Paper>
  );
  const Widget = ({ title, value, Icon }) => {
    return (
        <Paper elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
        width: "20rem",
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border: "5px solid rgba(36, 34, 34, 0.8)",
            width: "5rem",
            height: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {value}
        </Typography>
        <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
          {Icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
    );
  };
  const Widgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={data?.stats?.userscount} Icon={<PersonIcon />} />
      <Widget title={"Chats"} value={data?.stats?.totalchatscount} Icon={<GroupIcon />} />
      <Widget title={"Messages"} value={data?.stats?.messagecount} Icon={<MessageIcon />} />
    </Stack>
  );
  
  return isLoading?<Loaders/>:(
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}
        <Stack direction={"row"}  flexWrap={"wrap"} justifyContent={'center'} alignItems={{
          xs:"center",
          lg:"stretch"
        }}
        sx={{gap:"2rem"}}>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography>Last Messages</Typography>
            
            <LineChart value={data?.stats?.messageschart || []}/>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
              height: "25rem",
            }}
          >
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              minHeight={"25rem"}
            >
              <GroupIcon /> <Typography>Vs</Typography> <PersonIcon />
            </Stack>
           <DougnutChart  labels={['Single Chats','Group Chats']} value={[data?.stats?.totalchatscount -data?.stats?.groupscount || 0,data?.stats?.groupscount || 0]}/>
          </Paper>
        </Stack>

        {Widgets}
      </Container>
    </AdminLayout>
  );
}
export default AdminDashBoard;
