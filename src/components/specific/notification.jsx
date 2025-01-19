import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from "@mui/material";
import React, { memo, useState } from "react";
import { sampleNotifications } from "../../constants/sampledata";
import { useAcceptfriendrequestMutation, useGetnotificationQuery } from "../../redux/api/api";
import { useAsyncmutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setisNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
function Notification(){
    const {isLoading,data,error,isError}=useGetnotificationQuery()
    const [acceptfriendrequest]=useAcceptfriendrequestMutation()
    const {isNotification}=useSelector((state)=>state.misc)
   
    const dispatch=useDispatch()
    const notificationclosehandler=()=>{
        dispatch(setisNotification(false))
    }
    const friendreqhandler=async(_id,{accept})=>{
        
        dispatch(setisNotification(false))
        try {
          const res=  await acceptfriendrequest({requestId:_id,accept});
          if(res?.data?.success){
           
            toast.success(res?.data?.message)
          }
          else{
            toast.error(res?.data?.error ||"Something went wrong")
          }
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }
    }
    
    useErrors([{error,isError}])
    return (
        <Dialog open ={isNotification} onClose={notificationclosehandler}>
            <Stack p={{xs:'1rem' ,sm:'2rem'}} maxWidth={'25rem'}>
                <DialogTitle>Notifications</DialogTitle>
                {
                    isLoading?(<Skeleton/>):(
                        <>{
                            data?.allrequest.length>0?(
                                data?.allrequest.map((i)=>(<NotificationItem sender={i.sender} _id={i._id} key={i._id} friendreqhandler={friendreqhandler}/>))
                            ):(
                                <Typography textAlign={'center'}>No new Notifications</Typography>
                            )
                        }</>
                    )
                }
            </Stack>
        </Dialog>
    )
}
function NotificationItem({sender,_id,friendreqhandler}){
    const {name,avatar}=sender
    return (
        <ListItem >
            <Stack  direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
                <Avatar src={avatar}/>
                    <Typography variant="body1" sx={{
                        flexGrow:1,
                        display:'webkit-box',
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        color:"black"



                    }}>
                        {`${name} has sent you a friend request`}
                    </Typography>
                  <Stack direction={
                    {
                        xs:'column',
                        sm:'row'
                    }
                  }>
                  <Button onClick={()=>friendreqhandler(_id,{accept:true})}>Accept</Button>
                   <Button sx={{color:'red'}} onClick={()=>friendreqhandler(_id,{accept:false})}>Reject</Button>
               
                  </Stack>
            </Stack>
        </ListItem>
    )
}
export default memo(Notification)
