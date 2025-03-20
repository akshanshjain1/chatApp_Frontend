import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "../components/specific/map";
import { SEND_LOCATION, STOP_LIVE_LOCATION } from "../constants/events";
import { useSocketEvents } from "../hooks/hook";
import { getSocket } from "../socket";

function LiveLocation() {
  const socket = getSocket();
  const navigate = useNavigate();
  const { locationId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [location, setLocation] = useState(null);
  const [watcherId, setWatcherId] = useState(null);
  const [isSendingLiveLocation, setIsSendingLiveLocation] = useState(
    JSON.parse(localStorage.getItem("isSendingLiveLocation")) || false
  );
 

  const getAndUpdateLiveLocation = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLocation({ lat: latitude, lng: longitude });
          socket.emit(SEND_LOCATION, {
            latitude,
            longitude,
            locationId,
            SenderId: user._id,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 100,
        }
      );
      setWatcherId(id);
    }
  };

  const stopLiveLocation = () => {
    if (watcherId !== null) {
      navigator.geolocation.clearWatch(watcherId);
      setWatcherId(null);
    }
    setIsSendingLiveLocation(false);
    socket.emit(STOP_LIVE_LOCATION,{locationId,stopinguser:user._id})
    navigate("/");
  };

    const handleLiveLocationStopByOther=useCallback(({message})=>{
        if (watcherId !== null) {
            navigator.geolocation.clearWatch(watcherId);
            setWatcherId(null);
          }
          setIsSendingLiveLocation(false); 
          toast.error(message)
          navigate("/") ;

    })
  const setLongitudeLatitude = useCallback(
    (data) => {
      if (data.locationId.toString() !== locationId.toString()) return;

      setLocation({ lat: data.latitude, lng: data.longitude });
    },
    [locationId]
  );

  useEffect(() => {
    if (isSendingLiveLocation) {
      getAndUpdateLiveLocation();
    }
    return () => {
      if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, [isSendingLiveLocation]);

  useEffect(() => {
    if (isSendingLiveLocation) {
      localStorage.setItem("isSendingLiveLocation", JSON.stringify(true));
    } else {
      localStorage.removeItem("isSendingLiveLocation");
    }
  }, [isSendingLiveLocation]);

  const eventHandlers = {
    [SEND_LOCATION]: setLongitudeLatitude,
    [STOP_LIVE_LOCATION]:handleLiveLocationStopByOther
  };
  useSocketEvents(socket, eventHandlers);

  return (
    <div className="h-screen w-full relative flex flex-col">
      <MapComponent
        location={location}
        showMarker={true}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] bg-white  rounded-lg shadow-lg w-max flex justify-center">
        <button
          onClick={stopLiveLocation}
          className="px-2 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          stop live location
        </button>
      </div>
    </div>
  );
}

export default LiveLocation;
