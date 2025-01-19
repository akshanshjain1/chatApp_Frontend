import { Typography } from "@mui/material";
import React from "react";
import AppLayout from "../components/layout/applayout";
function Home(){
    return (
        <Typography textAlign={'center'} p={'2rem'} width={"100%"} >
          Select a friend to chat
        </Typography>
       
    )
}
export default AppLayout()(Home)