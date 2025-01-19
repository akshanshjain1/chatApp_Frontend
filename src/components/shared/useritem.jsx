import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { Add as AddIcon ,Remove as RemoveIcon} from "@mui/icons-material";
import { transformimage } from "../../libs/features";
function UserItem({user,handler,handlerisloading,isadded=false,styling={}}){
    const {name,_id,avatar}=user
    
    return (
        <ListItem >
            <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'} {...styling}>
                <Avatar src={transformimage(avatar)}/>
                    <Typography variant="body1" sx={{
                        flexGrow:1,
                        display:'webkit-box',
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        color:"black"



                    }}>
                        {name}
                    </Typography>
                    <IconButton  sx={{
                        bgcolor:isadded?'red':'primary.main',
                        color:'white',
                        ":hover":{
                            bgcolor:isadded?'darkred':'primary.dark'
                        }
                    }} onClick={()=>handler(_id)} disabled={handlerisloading}>
                    
                        {isadded?<RemoveIcon/>:<AddIcon/>
                        }
                    </IconButton>
               
            </Stack>
        </ListItem>
    )
}
export default memo(UserItem)