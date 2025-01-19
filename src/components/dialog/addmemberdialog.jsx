import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAsyncmutation, useErrors } from "../../hooks/hook.jsx";
import { useAddmemberMutation, useAvailablefriendsQuery } from "../../redux/api/api.js";
import { setisAddMember } from "../../redux/reducers/misc.js";
import Useritem from "../shared/useritem";

function AddmemberDialog({ ChatId }) {

const dispatch=useDispatch()
  const [addmembers,isaddingmembers]=useAsyncmutation(useAddmemberMutation)
  const {data,isLoading,isError,error}=useAvailablefriendsQuery(ChatId)
  
  const [members, setmembers] = useState([]);
  const [selectedmembers, setselectedmembers] = useState([]);
  const {isAddMember}=useSelector((state)=>state.misc)
  function selectmemberhandler(id) {
    setselectedmembers((prev) =>
      prev.includes(id) ? prev.filter((previd) => previd !== id) : [...prev, id]
    );
  }

  const addmembersubmithandler = () => {

    addmembers("Adding Members..",{chatId:ChatId,members:selectedmembers})
    closehandler();
  };
  const closehandler = () => {
    dispatch(setisAddMember(false))
    setmembers([])
    setselectedmembers([])
  };

    useEffect(()=>{
      if(data){
        setmembers(data.availablefriends)
      }
    },[data])

  useErrors([{isError,error}])
  return (
    <Dialog open={isAddMember} onClose={closehandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"} color={'black'}>
          {isLoading?(<Skeleton/>): members.length > 0 ? (
            members.map((i) => {
            return   <Useritem
                key={i._id}
                user={i}
                handler={selectmemberhandler}
                isadded={selectedmembers.includes(i._id)}
              />;
            })
          ) : ( 
            <Typography>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color={"error"} onClick={closehandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addmembersubmithandler}
            disabled={isaddingmembers}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default AddmemberDialog;
