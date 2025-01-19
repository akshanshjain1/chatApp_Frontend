import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, verifyadmin } from "../redux/thunks/admin";
function AdminLogin() {
  const dispatch=useDispatch()
  
  const secretkey = useInputValidation("");
  const submithandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretkey.value))

  };
 const {isAdmin}=useSelector((state)=>state.auth)
 useEffect(()=>{
  dispatch(verifyadmin())
},[dispatch])
  if(isAdmin) return <Navigate to='/admin/dashboard'/>

 
  return (
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
      height="100vh"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="hs">Admin Login</Typography>
        <form onSubmit={submithandler}>
          <TextField
            required
            fullWidth
            label="password"
            type="password"
            margin="normal"
            variant="outlined"
            value={secretkey.value}
            onChange={secretkey.changeHandler}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: "1rem" ,textAlign:"center"}}
            
            fullWidth
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
export default AdminLogin;
