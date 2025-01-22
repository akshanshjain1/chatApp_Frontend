import { useFileHandler, useInputValidation } from '6pp';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from '../constants/config';
import { userExists } from "../redux/reducers/auth";
import { usernamevalidater } from "../utils/validators";
function Login(){
   
    const name=useInputValidation("")
    const username=useInputValidation("",usernamevalidater)
    const password=useInputValidation("")
    const bio=useInputValidation("")
    const dispatch=useDispatch()
    const avatar=useFileHandler("single")
    const navigate=useNavigate()
    const [isloading,setisloading]=useState(false)
    //const password=useStrongPassword() for strong password use this
   const handleLogin =async(e)=>{
    e.preventDefault()
    
       
        const config={
            withCredentials:true,
            "Content-Type":"application/json"
        }
        try {
        setisloading(true)
         const {data}=  await axios.post(`${server}/api/v1/user/login`,{
                username:username.value,
                password:password.value
            },config);
            dispatch(userExists(data.data))
            toast.success(data.message)
            navigate("/")
            
            
        } catch (error) {
          
            toast.error(error?.response?.data?.message?.data||"Something went wrong")
        }
        finally{
            setisloading(false)
        }
    };
    
    
    return(
    <Container component={"main"} maxWidth="xs" sx={{display:'flex' , flexDirection:'column',alignItems:'center',justifyContent:"center",height:"100vh"}} height="100vh">
        <Paper elevation={3} sx={{padding:4, display:'flex',flexDirection:'column',alignItems:'center'}}>
            {(

                <>
                <Typography variant="hs">Login</Typography>
                <form onSubmit={handleLogin} >
                    <TextField
                    required
                    fullWidth
                    label="username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}/>
                    <TextField
                    required
                    fullWidth
                    label="password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}/>
                    

                    <Button variant="contained" color="primary" type="submit" sx={{marginTop:'1rem',textAlign:"center" }} fullWidth disabled={isloading}>
                    {
                        isloading?("Logging in"):("Log in")
                    }
                    </Button>
                    <Typography textAlign="center"  marginTop={`1rem`}>Or</Typography>
                    <Button sx={{marginTop:'1rem'}} fullWidth variant="text"  onClick={()=>navigate("/signup")} disabled={isloading}>Sign up</Button>
                </form>
                </>

            )}
            

        </Paper>
    </Container>)
}
export default Login