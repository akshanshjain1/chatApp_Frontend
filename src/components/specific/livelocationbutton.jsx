import { v4 as uuidv4 } from "uuid";
import { FaMapMarkerAlt } from "react-icons/fa"; // Location icon
import { getSocket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useSocketEvents } from "../../hooks/hook";
import toast from "react-hot-toast";
import { LIVE_LOCATION_REQ_ACCEPTED, REJECT_LIVE_LOCATION, SEND_LIVE_LOCATION_NOTIFICATION } from "../../constants/events";
import { setisSendingLiveLocation } from "../../redux/reducers/misc";
const LiveLocationButton = ({ chatId,disabled=false }) => {
  const socket = getSocket();
  const user=useSelector((state)=>{
    return state.auth.user;
  })
    const dispatch=useDispatch()
    const navigate=useNavigate();
   
  const handleShareLocation = () => {
    const locationId = uuidv4(); // Generate unique ID for live session

    // Notify recipient with popup
    socket.emit(SEND_LIVE_LOCATION_NOTIFICATION, {UserId:user._id, chatId, senderName:user.name, locationId });

    
  
  };
  const pageforwarder=useCallback((data)=>{
    
    if(data.Forward){
        
        toast.success("Sent Live Location Request");
        
    }
    else{
        toast.error("Your Friend is not online")
    }

  },[navigate])

  const handlelivelocationrejection=useCallback(({message})=>{
      toast.error(message)
  },[socket])

  const handlelivelocationacceptance=useCallback(({message,locationId})=>{
    toast.success(message);
   
    localStorage.setItem("isSendingLiveLocation", JSON.stringify(true))
    navigate(`/live-location/${locationId}`)
  },[navigate,socket])
  if(!user)
        return null;

  const eventhandlers = {
    [SEND_LIVE_LOCATION_NOTIFICATION]:pageforwarder,
    [REJECT_LIVE_LOCATION]:handlelivelocationrejection,
    [LIVE_LOCATION_REQ_ACCEPTED]:handlelivelocationacceptance
  };

  useSocketEvents(socket, eventhandlers);
  return (
    <button disabled={disabled}
      onClick={handleShareLocation}
      className=" bg-blue-600 text-white px-4 h-[90%] rounded-full shadow-lg hover:bg-blue-700 transition-all"
    >
      <FaMapMarkerAlt className="text-xl" />
      <span className="font-semibold"></span>
    </button>
  );
};

export default LiveLocationButton;
