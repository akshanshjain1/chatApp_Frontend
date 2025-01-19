import {
  ExitToApp as ExitToAppIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAsyncmutation } from "../../hooks/hook";
import {
  useDeletegroupMutation,
  useLeavegroupMutation,
} from "../../redux/api/api";
import { setisDeleteMenu } from "../../redux/reducers/misc";

const DeleteChatMenu = ({ dispatch, deleteOptionAnchor }) => {
  const navigate = useNavigate();
  const closehandler = () => {
    dispatch(setisDeleteMenu(false));
    deleteOptionAnchor.current = null;
  };

  const [deletechat, _, deletechatdata] = useAsyncmutation(
    useDeletegroupMutation
  );
  const [leavegroupchat, __, leavegroupdata] = useAsyncmutation(
    useLeavegroupMutation
  );

  const leavegrouphandler = () => {
    closehandler();
    leavegroupchat("Leaving Group", { chatId: selectedDeleteChat.chatId });
  };
  const deleteChathandler = () => {
    closehandler();
    deletechat("Unfriending...", { chatId: selectedDeleteChat.chatId });
  };

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  useEffect(() => {
    if (deletechatdata || leavegroupdata) navigate("/");
  }, [deletechatdata, leavegroupdata]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closehandler}
      anchorEl={deleteOptionAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={
          selectedDeleteChat.groupChat ? leavegrouphandler : deleteChathandler
        }
      >
        {selectedDeleteChat.groupChat ? (
          <>
            {" "}
            <ExitToAppIcon />
            <Typography>Leave Group</Typography>{" "}
          </>
        ) : (
          <>
            <PersonRemoveIcon /> <Typography>Unfriend</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};
export default DeleteChatMenu;
