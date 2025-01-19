import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, verifyadmin } from "../thunks/admin";
import toast from "react-hot-toast";
const initialState={
    user:null,
    isAdmin:false,
    isloading:true
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        userExists:(state,action)=>{
            state.user=action.payload,
            state.isloading=false
        },
        usernotExits:(state)=>{
            state.user=null,
            state.isloading=false
        }
        
    },

    extraReducers:(builder)=>{
        builder
        .addCase(adminLogin.fulfilled,(state,action)=>{
            state.isAdmin=true;
            toast.success(action.payload)
        })
        .addCase(adminLogin.rejected,(state,action)=>{
            state.isAdmin=false;
            toast.error(action.error.message)
        })
        .addCase(verifyadmin.fulfilled,(state,action)=>{
            
            if(action.payload)
                state.isAdmin=true
            else state.isAdmin=false
            
            
        })
        .addCase(verifyadmin.rejected,(state,action)=>{
            state.isAdmin=false
           
            
        })
        .addCase(adminLogout.fulfilled,(state,action)=>{
            state.isAdmin=false;
            toast.success(action.payload)
        })
        .addCase(adminLogout.rejected,(state,action)=>{
           
            toast.success(action.payload)
        })
    }

})

export const {userExists,usernotExits}=authSlice.actions;
export default authSlice