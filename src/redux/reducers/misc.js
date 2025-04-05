import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobileMenu: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
  isCallComing:false,
  isCallingToSomeOne:false,
  ringtonePlayed:false,
  isLiveLocationComing:false,
  isAllowSmartReply:false,
  isShowSmartReply:false
  
 
};
const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setisNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setisAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setisNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setisMobileMenu: (state, action) => {
      state.isMobileMenu = action.payload;
    },
    setisSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setisFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setisDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setuploadingLoader:(state,action)=>{
      state.uploadingLoader=action.payload

    },
    setselectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
    setisCallComing:(state,action)=>{
      state.isCallComing=action.payload
    },
    setisCallingToSomeOne:(state,action)=>{
      state.isCallingToSomeOne=action.payload
    },
    setRingtonePlayed:(state,action)=>{
      state.ringtonePlayed=action.payload

    },
    setisLiveLocationComing:(state,action)=>{
      state.isLiveLocationComing=action.payload
    },
    setisAllowSmartReply:(state,action)=>{
      state.isAllowSmartReply=action.payload
    },
    setisShowSmartReply:(state,action)=>{
      state.isShowSmartReply=action.payload
    }
    
    
  },
});

export const {
  setisAddMember,
  setisDeleteMenu,
  setisFileMenu,
  setisMobileMenu,
  setisNewGroup,
  setisNotification,
  setisSearch,
  setuploadingLoader,
  setselectedDeleteChat,
  setisCallComing,
  setisCallingToSomeOne,
  setRingtonePlayed,
  setisLiveLocationComing,
  setisAllowSmartReply,
  setisShowSmartReply
  
  
} = miscSlice.actions;
export default miscSlice;
