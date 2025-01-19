import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useInputValidation } from '6pp';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLazySearchUserQuery, useSendfriendrequestMutation } from "../../redux/api/api";
import { setisSearch } from "../../redux/reducers/misc";
import Useritem from "../shared/useritem";
import { useAsyncmutation } from '../../hooks/hook';
function Search(){
    const {isSearch}=useSelector((state)=>state.misc)
    const [searchUser]=useLazySearchUserQuery()
   
    const [sendfriendrequest,isloadigsendfriendrequest]=useAsyncmutation(useSendfriendrequestMutation)
    const search=useInputValidation('')
    const addfriendhandler=async(id)=>{
       await sendfriendrequest("sending friend request bro...",{userId:id})
    }
    const dispatch=useDispatch()
    const searchclosehandler=()=>{
        dispatch(setisSearch(false))
    }
    const [users,setusers]=useState([])
    

    useEffect(()=>{
        const timeoutid=setTimeout(()=>{

            searchUser(search.value)
            .then(({data})=>{
               
                setusers(data.users)})
            .catch((err)=>console.log(err))

        },1000)
        return ()=>{
            clearTimeout(timeoutid)
        }

    },[search.value])
    return( 
    <Dialog open={isSearch} onClose={searchclosehandler}>
        <Stack p={'2rem'} width={'25rem'}>
        <DialogTitle textAlign={'center'}>Find People</DialogTitle>  
        <TextField label="" 
        value={search.value} 
        onChange={search.changeHandler} 
        variant="outlined" 
        size="small" 
        InputProps={{
            startAdornment:(
                <InputAdornment position="start">
                    <SearchIcon/>
                </InputAdornment>
            )
        }}
        />  
        <List>
            
            {
                users.map((i)=>(
                    <Useritem user={i} key={i._id} handler={addfriendhandler} handlerisloading={isloadigsendfriendrequest}/>
                ))
                
            }
        </List>
        </Stack>
    </Dialog>
    );
}
export default Search