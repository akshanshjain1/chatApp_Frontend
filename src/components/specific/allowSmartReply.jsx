import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Typography,
    Divider,
    Box,
    IconButton,
  } from "@mui/material";
  import { useDispatch, useSelector } from "react-redux";
  import { setisAllowSmartReply } from "../../redux/reducers/misc";
  import axios from "axios";
  import { toast } from "react-hot-toast";
  import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
  import SecurityIcon from "@mui/icons-material/Security";
  import GppGoodIcon from "@mui/icons-material/GppGood";
  import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
  import CloseIcon from "@mui/icons-material/Close";
  import { server } from "../../constants/config";
import { userExists } from "../../redux/reducers/auth";
  
  
  function SmartReply() {
    const dispatch = useDispatch();
    const { isAllowSmartReply } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
  
    const closeHandler = () => {
      dispatch(setisAllowSmartReply(false));
    };
  
    const AcceptAutoReply = async () => {
      try {
        await axios.patch(`${server}/api/v1/user/allowAutoReply/${user._id}`,{},{withCredentials:true});
        const {data}=await axios.get(`${server}/api/v1/user/me`,{withCredentials:true});
       
        dispatch(userExists(data.user))
        toast.success("Smart Reply enabled!");
        closeHandler();
      } catch {
        toast.error("Couldn't enable Smart Reply.");
      }
    };
  
    const CancelAutoReply = async () => {
      try {
        await axios.patch(`${server}/api/v1/user/disableAutoReply/${user._id}`,{},{withCredentials:true});
        const {data}=await axios.get(`${server}/api/v1/user/me`,{withCredentials:true});
       
        dispatch(userExists(data.user))
        toast.success("Smart Reply disabled.");
        closeHandler();
      } catch {
        toast.error("Couldn't disable Smart Reply.");
      }
    };
  
    return (
      <Dialog
        open={isAllowSmartReply}
        onClose={closeHandler}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon color="primary" /> Smart Reply Consent
          </DialogTitle>
          <IconButton onClick={closeHandler}>
            <CloseIcon />
          </IconButton>
        </Box>
  
        <DialogContent>
  <Stack spacing={2}>
    {!user.allowAutoReply ? (
      <>
        <Typography variant="body1">
          You're about to enable <strong>Smart Auto Reply</strong>, powered by <strong>LLaMA 3.3 - 70B</strong> — an advanced open-source AI model designed to help you respond faster and smarter.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <SecurityIcon color="primary" />
          <Typography variant="body2" color="text.secondary">
            To generate meaningful replies, we temporarily send your <strong>last 15 messages</strong> to our AI engine. These are used only for response generation and <strong>are never stored or reused</strong>.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <GppGoodIcon color="success" />
          <Typography variant="body2" color="text.secondary">
            Your chats remain <strong>end-to-end encrypted</strong>. Smart Reply only decrypts recent messages while generating replies, and does not affect your overall chat security.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <InfoOutlinedIcon color="warning" />
          <Typography variant="body2" color="text.secondary">
            Avoid enabling this feature for conversations that contain <strong>confidential or sensitive information</strong>.
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          🔒 <strong>You’re in control.</strong> This feature is optional. You can disable it anytime in Settings.
          By enabling it, you agree to temporarily share your last 15 messages with our AI engine for the purpose of reply generation.
        </Typography>
      </>
    ) : (
      <>
        <Typography variant="body1">
          <strong>Smart Auto Reply</strong> is currently <strong>enabled</strong> on your account. It's helping you generate faster replies using the power of <strong>LLaMA 3.3 - 70B</strong>.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <GppGoodIcon color="success" />
          <Typography variant="body2" color="text.secondary">
            Your last 15 messages in each chat are temporarily sent to the AI engine when Smart Reply is triggered.
            We do not store or reuse your data, and your conversations remain end-to-end encrypted otherwise.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <InfoOutlinedIcon color="warning" />
          <Typography variant="body2" color="text.secondary">
            If you're no longer comfortable with this, you can disable Smart Reply below.
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          🔒 Smart Reply will stop accessing your messages once disabled. You can always re-enable it later.
        </Typography>
      </>
    )}
  </Stack>
</DialogContent>


  
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          {!user.allowAutoReply ? (
            <>
              <Button variant="outlined" onClick={closeHandler}>
                Not Now
              </Button>
              <Button variant="contained" color="primary" onClick={AcceptAutoReply}>
                Enable Smart Reply
              </Button>
            </>
          ) : (
            <Button variant="outlined" color="error" onClick={CancelAutoReply}>
              Disable Smart Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
  
  export default SmartReply;
  