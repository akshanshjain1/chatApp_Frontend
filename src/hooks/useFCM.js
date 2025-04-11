import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../services/firebaseConfig";
import {server} from "../constants/config"
import axios from "axios";
const VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

export const useFCM = (userId, setShowNotifPrompt) => {
  useEffect(() => {
    if (!userId) return;

    const registerToken = async () => {
      const permission = Notification.permission;
      const res = await axios.get(`${server}/api/v1/user/has-fcm-token?userId=${userId}`,{withCredentials:true});
  
      const { hasToken } = res.data;
      
      
      if (permission === "granted" && !hasToken) {
        try {
         
          const token = await getToken(messaging, { vapidKey: VAPID_KEY });
         
          await axios.post(`${server}/api/v1/user/save-fcm-token`,{token,userId},{withCredentials:true})
        } catch (err) {
          console.error("Token error:", err);
        }
      } else if (permission==="default") {
        setShowNotifPrompt(true);
      }
      else if(permission==="denied" && hasToken){
        await axios.post(`${server}/api/v1/user/save-fcm-token`,{token:null,userId},{withCredentials:true})
      }
    };

    registerToken();

   return ()=> onMessage(messaging, (payload) => {
      alert(`${payload.notification.title}\n${payload.notification.body}`);
    }) ();
  }, [userId, setShowNotifPrompt]);
};