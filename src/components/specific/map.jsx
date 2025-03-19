import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap,Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
const blackCircleIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="
    width: 16px;
    height: 16px;
    background-color: black;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8], // Centering the marker
});

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 }; // New Delhi (Default Center)
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom]);
    return null;
  };
const MapComponent = ({ location }) => {
  const [isClient, setIsClient] = useState(false);
    const [mapCenter,setmapCenter]=useState([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng])
    const [render,setrender]=useState()
  useEffect(() => {
    setIsClient(true);
    if(location)
        setmapCenter([location.lat, location.lng])
  }, [location]);

  

  if (!isClient) return <div className="h-screen w-full bg-gray-200">Loading Map...</div>;

  

  return (
    <div className="h-full w-full">
        <MapContainer center={mapCenter} zoom={location?16:8} className="h-[100%] w-[100%]" >
        <ChangeView center={mapCenter} zoom={location ? 16 : 8} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="@ChatKaro" />
      {location && (
        <>
        {/* <Circle
        center={mapCenter}
        radius={50} 
        color="rgba(0, 0, 0, 0.5)" 
        fillColor="rgba(0, 0, 0, 0.2)" 
        fillOpacity={0.3}
      /> */}
        <Marker position={mapCenter} icon={blackCircleIcon}>
          <Popup>Current Location</Popup>
        </Marker></>
      )}
      <div></div>
    </MapContainer>
    </div>
  );
};

export default MapComponent;
