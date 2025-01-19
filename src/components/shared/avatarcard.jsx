import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";
import { transformimage } from "../../libs/features";
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={'row'} spacing={0.5} margin={'0.5rem'}>
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        <Box sx={{display:"flex" , flexDirection:"row"}} >
          {avatar.map((i, index) => (
            <Avatar
              key={index}
              src={transformimage(i)}
             alt={`AVATAR ${index}`}
              style={{
                
                width: "2rem",
                height: "2rem",
                border: "2px solid white",
                left: {
                  xs: `${ 0.5+index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box >
      </AvatarGroup>
    </Stack>
  );
};
export default AvatarCard;
