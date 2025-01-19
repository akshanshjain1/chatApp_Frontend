import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSendattachmentsMutation } from "../../redux/api/api";
import { setisFileMenu, setuploadingLoader } from "../../redux/reducers/misc";
function FileMenu({ anchorE1, chatId }) {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const imageref = useRef(null);
  const audioref = useRef(null);
  const videoref = useRef(null);
  const fileref = useRef(null);

  const [sendattchments] = useSendattachmentsMutation();

  const handleclose = () => {
    dispatch(setisFileMenu(false));
  };
  const selectRef = (ref) => {
    ref.current?.click();
  };
  const filechangehandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length > 5)
      return toast.error(`You can send at max 5${key} at a time `);
    dispatch(setuploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    handleclose();

    try {
      const formdata = new FormData();
      formdata.append("chatid", chatId);
      files.forEach((file) => formdata.append("files", file));
      const res = await sendattchments(formdata);
      if (res.data)
        toast.success(`${key} sent successfully`, {
          id: toastId,
        });
      else
        toast.error(`Failed to send ${key}`, {
          id: toastId,
        });
    } catch (error) {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      dispatch(setuploadingLoader(false));
    }
  };
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={handleclose}>
      <div style={{ width: "10rem" }}>
        <MenuList>
          <MenuItem onClick={() => selectRef(imageref)}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg,image/gif"
              style={{ display: "none" }}
              onChange={(e) => filechangehandler(e, "Images")}
              ref={imageref}
            ></input>
          </MenuItem>
          <MenuItem onClick={() => selectRef(audioref)}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              accept="audio/mpeg, audio/wave"
              multiple
              style={{ display: "none" }}
              onChange={(e) => filechangehandler(e, "Audios")}
              ref={audioref}
            ></input>
          </MenuItem>
          <MenuItem onClick={() => selectRef(videoref)}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              accept="video/mp4 video/webm, video/ogg"
              multiple
              style={{ display: "none" }}
              onChange={(e) => filechangehandler(e, "Videos")}
              ref={videoref}
            ></input>
          </MenuItem>
          <MenuItem onClick={() => selectRef(fileref)}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Files</ListItemText>
            <input
              type="file"
              accept="*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => filechangehandler(e, "Files")}
              ref={fileref}
            ></input>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
}
export default FileMenu;
