import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const adminLogin=createAsyncThunk("admin/login",async(secretkey)=>{
    try {
        const config={
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        };
    
        const {data}=await axios.post('/api/v1/admin/verify',{secretkey},config)
    
        return data.message
    } catch (error) {
        throw error.response.data.message
    }

})


const verifyadmin=createAsyncThunk("admin/getadminstatus",async()=>{
    try {
        
    
        const {data}=await axios.get('/api/v1/admin/',{withCredentials:true})
        
    
        return data.admin
    } catch (error) {
        throw error.response.data.message
    }

})

const adminLogout=createAsyncThunk("admin/logout",async()=>{
    try {
        
    
        const {data}=await axios.post('/api/v1/admin/logout',{withCredentials:true})
        
    
        return data.message
    } catch (error) {
        throw error.response.data.message
    }

})
export {adminLogin,verifyadmin,adminLogout}