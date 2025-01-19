import { configureStore } from '@reduxjs/toolkit';
import api from './redux/api/api';
import authSlice from './redux/reducers/auth';
import chatSlice from './redux/reducers/chat';
import miscSlice from './redux/reducers/misc';
const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [api.reducerPath]:api.reducer
    },
    middleware:(defaultmiddleware)=>[...defaultmiddleware(),api.middleware]
})

export default store