import { createSlice } from "@reduxjs/toolkit";
import { getorsavefromstorage } from "../../libs/features";
import { NEW_MESSAGES_ALERT } from "../../constants/events";
const initialState = {
  notificationcount: 0,
  newMessagesAlert: getorsavefromstorage({
    key: NEW_MESSAGES_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    increamentnotification: (state) => {
      state.notificationcount += 1;
    },
    resetnotification: (state) => {
      state.notificationcount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      
      const chatId = action.payload.chatId;
     
      
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === chatId
      );
      if (index !== -1) {
        
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },
    removeNewMessageAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export const {
  increamentnotification,
  resetnotification,
  setNewMessagesAlert,
  removeNewMessageAlert,
} = chatSlice.actions;
export default chatSlice;
