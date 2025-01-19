import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { Face as FaceIcon ,AlternateEmail as UsernameIcon,CalendarMonth as CalenderIcon, AspectRatio} from "@mui/icons-material";
import moment from 'moment'
import { useSelector } from "react-redux";
import { transformimage } from "../../libs/features";
function Profile(){
    const {user}=useSelector((state)=>state.auth)
    return (
        <Stack spacing={'2rem'} alignItems={'center'} >
            <Avatar sx={{width:'70%', height:"70%" ,marginBottom:'1rem', border:'3px solid white'
            }} src={transformimage(user?.avatar?.url)}/>
            <ProfileCard heading={'Bio'} text={user?.bio} />
            <ProfileCard heading={'username'} text={user?.username} Icon={<UsernameIcon/>}/>
            <ProfileCard heading={'Name'} text={user?.name} Icon={<FaceIcon/>}/>
            <ProfileCard heading={'Joined'} text={moment(`${user?.createdAt}`).fromNow()} Icon={<CalenderIcon/>}/>
        </Stack>
    )
}
function ProfileCard({text,Icon,heading}){
  return (  <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} color={'white'} textAlign={'center'}>
        {Icon && Icon}
        <Stack>
            <Typography variant="body1">{text}</Typography>
            <Typography color="gray" variant="caption"> {heading}</Typography>
        </Stack>

    </Stack>
  );
}
export default Profile