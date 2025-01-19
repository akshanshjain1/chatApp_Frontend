import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loaders from "../components/layout/loaders";
import AvatarCard from "../components/shared/avatarcard";
import Useritem from "../components/shared/useritem";
import { Link } from "../components/styles/styledcomponents";
import { gradient } from "../constants/color";
import { useAsyncmutation, useErrors } from "../hooks/hook";
import { useDeletegroupMutation, useGetchatdetailsQuery, useGetmygroupsQuery, useRemovememberMutation, useRenamegroupMutation } from "../redux/api/api";
import { setisAddMember } from "../redux/reducers/misc";
const AddmemberDialog = lazy(() =>
  import("../components/dialog/addmemberdialog")
);
const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialog/confirmdeletedialog")
);
function Group() {
  const dispatch=useDispatch()
  const [searchParmas] = useSearchParams();
  const chatId = searchParmas.get("group");
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };

  const mygroups=useGetmygroupsQuery()
  const groupdetails=useGetchatdetailsQuery({chatId:chatId,populate:true},{skip:!chatId})
  const [renamegroup,isupdating]=useAsyncmutation(useRenamegroupMutation)
  const [removemember,isremovingmember]=useAsyncmutation(useRemovememberMutation)
  const [deletegroup,isdeletinggroup]=useAsyncmutation(useDeletegroupMutation)
  
  
  const [ismobilemenuopen, setismobilemenuopen] = useState(false);
  const [isedit, setisedit] = useState(false);
  const [groupname, setgroupname] = useState("");
  const [groupnameupdatedvalue, setgroupnameupdatedvalue] = useState("");
  const [confirmdeteledialog, setconfirmdeletedialog] = useState(false);
  const [members,setmembers]=useState([])

  const {isAddMember}=useSelector((state)=>state.misc)
  const errors=[{
    isError:mygroups.isError,
    error:mygroups.error
  },
  {
    isError:groupdetails.isError,
    error:groupdetails.error
  }]
  
  useErrors(errors)

 
  
  const handlemobile = () => {
    setismobilemenuopen((prev) => !prev);
  };
  const handlemobileclose = () => {
    setismobilemenuopen(false);
  };
  const updategroupnamehandler = () => {
      setisedit(false);
      renamegroup("Updating Group name...",{chatId,name:groupnameupdatedvalue})
  };
  const openconfirmdeletehandler = () => {
    setconfirmdeletedialog(true);

  };
  const closeconfirmdeletehandler = () => {
    setconfirmdeletedialog(false);
  };
  const openaddmemberhandler = () => {
    dispatch(setisAddMember(true))
  };
  const deletehandler = () => {
    deletegroup("Deleting Group...",{chatId})
    closeconfirmdeletehandler();
    navigate("/")
  };
  const remvoememberhandler = (id) => {
    removemember("Removing member",{ChatId:chatId,UserId:id})
  };
  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <Tooltip title="Menu">
          <IconButton onClick={handlemobile}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Tooltip title="back">
        <IconButton
          onClick={navigateBack}
          sx={{
            width: "2rem",
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isedit ? (
        <>
          <TextField
            value={groupnameupdatedvalue}
            onChange={(e) => setgroupnameupdatedvalue(e.target.value)}
          />
          <IconButton onClick={() => updategroupnamehandler()} disabled={isupdating}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupname}</Typography>
          <IconButton onClick={() => setisedit(true)} disabled={isupdating}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  const ButtonGrp = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openconfirmdeletehandler}
      >
        Delete Group
      </Button>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={openaddmemberhandler}
      >
        Add Member
      </Button>
    </Stack>
  );

  useEffect(() => {
    if (groupdetails.data) {
      setgroupname(`${groupdetails.data.chat.name}`);
      setgroupnameupdatedvalue(`${groupdetails.data.chat.name}`);
      setmembers(groupdetails.data.chat.members)
    }
    return () => {
      setgroupname("");
      setgroupnameupdatedvalue("");
      setmembers([]);
      setisedit(false);
    };
  }, [groupdetails.data]);
  return mygroups.isLoading ? (<Loaders/>) :(
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
            background: gradient,
          },
        }}
        height={"100%"}
        sm={4}
      >
        {<GroupsList Groups={mygroups?.data?.groups} chatId={chatId} />}
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          position: "relative",
          padding: "1rem 2rem",
        }}
      >
        {IconBtns}
        {groupname && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"0.3rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {isremovingmember ?<CircularProgress/> :members.map((i) => (
                <Useritem
                  user={i}
                  key={i._id}
                  styling={{
                    boxShadow: "0 0 0.5rem 0.5rem rgba(0,0,0,0.2)",
                    padding: "0.6rem 2rem",
                    borderRadius: "2rem",
                  }}
                  handler={remvoememberhandler}
                  isadded
                />
              ))}
            </Stack>
            {ButtonGrp}
          </>
        )}
      </Grid>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddmemberDialog  ChatId={chatId}/>
        </Suspense>
      )}
      {confirmdeteledialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmdeteledialog}
            handleclose={closeconfirmdeletehandler}
            deletehandler={deletehandler}
          />
        </Suspense>
      )}
      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={ismobilemenuopen}
        onClose={handlemobileclose}
      >
        <GroupsList w={"50vw"} Groups={mygroups?.data?.groups} chatId={chatId}/>
      </Drawer>
    </Grid>
  );
}

const GroupsList = ({ w = "100%", Groups = [], chatId }) => (
  <Stack
    width={w}
    boxSizing={"border-box"}
    spacing={"0.2rem"}
    height={"100%"}
    overflow={"auto"}
    sx={{background:`${gradient}`}}
  >
    {Groups.length > 0 ? (
      Groups.map((i) => (
        <GroupsListItem key={i._id} group={i} chatId={chatId} />
      ))
    ) : (
      <Typography textAlign={"center"} padding={"1rem"}>
        No groups
      </Typography>
    )}
  </Stack>
);

const GroupsListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      sx={{ borderRadius: "1rem" }}
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack
        direction={"row"}
        spacing={"1rem"}
        alignItems={"center"}
        sx={{ borderRadius: "2rem" }}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Group;
