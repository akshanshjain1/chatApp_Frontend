import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { setisShowSmartReply } from "../../redux/reducers/misc";

function SmartReplyBox({ replies, setmessage }) {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tabLabels = ["Replies", "Continuations"];
  const selectedTabKey = tabIndex === 0 ? "replies" : "continuations";
  const selectedReplies = replies?.[selectedTabKey] || {};
  const baseText = replies?.replyTo || replies?.continueFrom || "";

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);
  const handleClose = () => dispatch(setisShowSmartReply(false));

  return (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        bottom: isMobile ? "8%" : "12%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "95%",
        maxWidth: "700px",
        bgcolor: "#fafafa",
        borderRadius: 3,
        p: isMobile ? 1.5 : 2,
        zIndex: 30,
        boxShadow: 10,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            maxWidth: "85%",
            whiteSpace: "wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            background: "linear-gradient(90deg, #1976d2, #9c27b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
           Smart Suggestions for: “{baseText}”
        </Typography>

        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 1 }}
      >
        {tabLabels.map((label, idx) => (
          <Tab label={label} key={idx} />
        ))}
      </Tabs>

      <Divider sx={{ mb: 1 }} />

      {!replies ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Box key={i}>
            <Skeleton variant="text" width={120} height={24} />
            <Stack direction="row" spacing={1} mt={1}>
              {Array.from({ length: 3 }).map((__, j) => (
                <Skeleton
                  key={j}
                  variant="rounded"
                  width={100}
                  height={32}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          </Box>
        ))
      ) : (
        <Stack
          spacing={2}
          sx={{
            maxHeight: "260px",
            overflowY: "auto",
            pr: 1,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "8px",
            },
          }}
        >
          {Object.keys(selectedReplies).map((category) => (
            <Box key={category}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#616161",
                  mb: 0.5,
                  fontWeight: 500,
                  fontSize: isMobile ? "0.80rem" : "1rem",
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {selectedReplies[category].map((reply, idx) => (
                  <Chip
                    key={idx}
                    label={
                      <Typography
                        sx={{
                          whiteSpace: "normal", // allows wrapping
                          wordBreak: "break-word", // breaks long words
                          lineHeight: 1,
                          fontSize: "0.85rem",
                          textAlign: "center",
                          px: 0.5,
                        }}
                      >
                        {reply}
                      </Typography>
                    }
                    onClick={() => setmessage(reply)}
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.80rem",
                      backgroundColor: "#f1f1f1",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

export default SmartReplyBox;
