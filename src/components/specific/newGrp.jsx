import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleusers } from "../../constants/sampledata";
import Useritem from "../shared/useritem";
import { useAvailablefriendsQuery, useMakeNewgroupMutation } from "../../redux/api/api";
import { useAsyncmutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setisNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

function NewGrp() {
  const { isError, data, isLoading, error } = useAvailablefriendsQuery();
  const [makeNewgroup,isLoadingNewGroup]=useAsyncmutation(useMakeNewgroupMutation)
  const groupname = useInputValidation("");
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);
  const [members, setmembers] = useState(sampleusers);
  const [selectedmembers, setselectedmembers] = useState([]);
  function selectmemberhandler(id) {
    setselectedmembers((prev) =>
      prev.includes(id) ? prev.filter((previd) => previd !== id) : [...prev, id]
    );
  }
  const submithandler = () => {
    if (!groupname.value) return toast.error("Give Group Name Please");
    if (selectedmembers.length < 2) {
      return toast.error("Atleast 3 Members Should be There in Grp");
    }
    makeNewgroup("Creating new Group...",{name:groupname.value,members:selectedmembers})
    closehandler()

  };
  const closehandler = () => {
    dispatch(setisNewGroup(false));
  };

  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);
  return (
    <Dialog open={isNewGroup} onClose={closehandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          placeholder={"Group Name"}
          value={groupname.value}
          onChange={groupname.changeHandler}
        />
        <Typography>Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((i) => (
              <Useritem
                user={i}
                key={i._id}
                handler={selectmemberhandler}
                isadded={selectedmembers.includes(i._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button sx={{ color: "error" }} onClick={closehandler}>Cancel</Button>
          <Button variant="contained" onClick={submithandler} disabled={isLoadingNewGroup}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
export default NewGrp;
