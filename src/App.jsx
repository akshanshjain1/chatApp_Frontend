import axios from 'axios';
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from "./components/auth/protectroute";
import Loaders from "./components/layout/loaders";
import "./index.css";
import Room from "./pages/room";
import { userExists, usernotExits } from "./redux/reducers/auth";
import { SocketProvider } from "./socket";
import { server } from './constants/config';



const UserManagement = lazy(() => import("./pages/usermanagement"));
const ChatManagement = lazy(() => import("./pages/chatmanagement"));
const MessageManagement = lazy(() => import("./pages/messagemanagement"));
const AdminDashBoard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/notfound"));
const Group = lazy(() => import("./pages/group"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Signup =lazy(()=>import ('./pages/signup')) ;
const Chat = lazy(() => import("./pages/chat"));
const AdminLogin = lazy(() => import("./pages/adminlogin"));

function App() {

  const dispatch=useDispatch()
  const {user,isloading}=useSelector((state)=>state.auth)
 
  //  const router =createBrowserRouter([
  //   {
  //     path:'/',
  //     element:<ProtectRoute user={user}><Home></Home></ProtectRoute>
  //   },
  //   {
  //     path:'/login',
  //     element:<Login/>
  //   },
  //   {
  //     path:'/group',
  //     element:<Group/>
  //   },
  //   {
  //     path:'/chat/:chatId',
  //     element:<Chat/>
  //   }
  //  ])

    useEffect(()=>{
      
      axios
        .get(`${server}/api/v1/user/me`,{withCredentials:true})
       .then((res)=>dispatch(userExists(res.data.user)))
       .catch((err)=>dispatch(usernotExits()))
    },[dispatch])

    return isloading?(
      <Loaders/>):(
    
  
    // <RouterProvider router={router}/>
    <BrowserRouter>
      <Suspense fallback={<Loaders />}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} redirect="/login"/>
            </SocketProvider>}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Group />} />
            <Route path="/room/:roomId" element={<Room/>}/>
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login/>
              </ProtectRoute>
            }
          />
           <Route
            path="/signup"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Signup/>
              </ProtectRoute>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/chat-management" element={<ChatManagement />} />
          <Route
            path="/admin/message-management"
            element={<MessageManagement />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;
