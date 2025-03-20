import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Slide } from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setisLiveLocationComing } from "../../redux/reducers/misc";
import { LIVE_LOCATION_REQ_ACCEPTED, REJECT_LIVE_LOCATION } from "../../constants/events";
import { getSocket } from "../../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LiveLocationDialog = ({ open,LiveLocationInfo,setLiveLocationInfo }) => {
 
  const socket=getSocket()
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const handleAccept = () => {
    dispatch(setisLiveLocationComing(false))
    socket.emit(LIVE_LOCATION_REQ_ACCEPTED,LiveLocationInfo)
    localStorage.removeItem("isSendingLiveLocation")
    navigate(`/live-location/${LiveLocationInfo.locationId}`);
    setLiveLocationInfo(null)
   
  };

  const handleReject = () => {
    dispatch(setisLiveLocationComing(false))
    socket.emit(REJECT_LIVE_LOCATION,  LiveLocationInfo );
    setLiveLocationInfo(null)
    
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted >
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-4 w-[300px] md:w-[400px]">
        <DialogTitle className="text-lg font-semibold flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-500" /> Live Location Request
        </DialogTitle>

        <DialogContent>
          <p className="text-gray-300"> {LiveLocationInfo?.message}</p>

          
        </DialogContent>

        <DialogActions className="flex justify-between mt-3">
          <Button onClick={handleReject} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Reject
          </Button>
          <Button onClick={handleAccept} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Start Tracking
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default LiveLocationDialog;
