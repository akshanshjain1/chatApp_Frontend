import { useFileHandler, useInputValidation } from '6pp';
import { CameraAlt } from '@mui/icons-material';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VisuallyHiddenInput } from "../components/styles/styledcomponents";
import { userExists } from "../redux/reducers/auth";
import { usernamevalidater } from "../utils/validators";
import { server } from '../constants/config';
function Login(){
    const [islogin,setislogin]=useState(true)
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
            
            
        } catch (error) {
          
            toast.error(error?.response?.data?.message||"Something went wrong")
        }
        finally{
            setisloading(false)
        }
    };
    async function handleSignup(e){
        e.preventDefault();
        const formdata=new FormData();
        formdata.append("name",name.value);
        formdata.append("password",password.value);
        formdata.append("username",username.value);
        formdata.append("bio",bio.value);
        formdata.append("avatar",avatar.file);
      
        try {
            setisloading(true)
            const {data}=await axios.post(`${server}/api/v1/user/newuser`,formdata,{
                withCredentials:true,
                "Content-Type":"multipart/form-data"
            });
           
             dispatch(userExists(data.data));
            toast.success(data.message)

        } catch (error) {
            toast.error(error?.response?.data?.message||"Something went wrong")       
        }
        finally{
            setisloading(false)
        }



    };
    useEffect(()=>{},[dispatch])
    return(
    <Container component={"main"} maxWidth="xs" sx={{display:'flex' , flexDirection:'column',alignItems:'center',justifyContent:"center",height:"100vh"}} height="100vh">
        <Paper elevation={3} sx={{padding:4, display:'flex',flexDirection:'column',alignItems:'center'}}>
            {islogin?(

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
                    <Button sx={{marginTop:'1rem'}} fullWidth variant="text"  onClick={()=>setislogin(prev=>!prev)} disabled={isloading}>Sign up</Button>
                </form>
                </>

            ):( <>
                <Stack 
                    position={"relative"}
                    width={"10rem"}
                    margin={"auto"}
                >
                <Avatar sx={{width:'10rem' , height:'10rem' ,objectFit:'contain'}} src={avatar.preview}></Avatar>
                {
                        avatar.error && (
                            <Typography color="error" variant=" caption">{avatar.error}</Typography>
                        )
                    }
                <IconButton sx={{position:'absolute', bottom:0 ,right:0 ,bgcolor:'rgba(0 255 0 255)'} } component="label"><><CameraAlt/>
                <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                </></IconButton>
                </Stack>

                <Typography variant="hs">Sign Up</Typography>
                <form onSubmit={handleSignup}>
                <TextField
                    required
                    fullWidth
                    label="name"
                    margin="normal"
                    variant="outlined"
                    value={name.value}
                    onChange={name.changeHandler}/>
                    <TextField
                    required
                    fullWidth
                    label="bio"
                    margin="normal"
                    variant="outlined"
                    value={bio.value}
                    onChange={bio.changeHandler}/>
                    <TextField
                    required
                    fullWidth
                    label="username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}/>
                    {
                        username.error && (
                            <Typography color="error" variant=" caption">{username.error}</Typography>
                        )
                    }
                    <TextField
                    required
                    fullWidth
                    label="password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}/>
                    {
                       password.error && (
                            <Typography color="error" variant=" caption">{password.error}</Typography>
                        )
                    }
                    <Button variant="contained" color="primary" type="submit" sx={{marginTop:'1rem',textAlign:"center"}}  fullWidth disabled={isloading}>
                        
                        {isloading?("Signing Up"):("Sign Up")}
                    </Button>
                    <Typography textAlign="center"  marginTop={`1rem`}>Or</Typography>
                    <Button sx={{marginTop:'1rem'}} fullWidth variant="text"  onClick={()=>setislogin((prev)=>!prev)} disabled={isloading}>Login</Button>
                </form>
                </>)}

        </Paper>
    </Container>)
}
export default Login