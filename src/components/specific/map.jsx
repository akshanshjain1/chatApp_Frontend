import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map, Globe, Mountain, LocateFixed } from "lucide-react";

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
  iconAnchor: [8, 8],
});

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 };

const TILE_LAYERS = {
  Satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  Streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  Terrain: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}" ,
};

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
};

const MapComponent = ({ location }) => {
  const [isClient, setIsClient] = useState(false);
  const [mapCenter, setMapCenter] = useState([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
  const [zoom, setZoom] = useState(location ? 18 : 8);
  const [selectedLayer, setSelectedLayer] = useState("Streets");

  useEffect(() => {
    setIsClient(true);
    if (location) {
      setMapCenter([location.lat, location.lng]);
    }
  }, [location]);

  const handleRecenter = () => {
    setZoom(location ? 16 : 8);
    setMapCenter(location ? [location.lat, location.lng] : [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
  };

  if (!isClient) return <div className="h-screen w-full bg-gray-200 flex items-center justify-center">Loading Map...</div>;

  return (
    <div className="h-full w-full relative">
      <MapContainer center={mapCenter} zoom={zoom} className="h-[100%] w-[100%]">
        <ChangeView center={mapCenter} zoom={zoom} />
        <TileLayer url={TILE_LAYERS[selectedLayer]} attribution="@ChatKaro" maxZoom={25}  />
        {location && (
          <Marker position={mapCenter} icon={blackCircleIcon}>
            <Popup>Current Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Type Controls */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-[0.7%] bg-white p-1 rounded-lg shadow-lg z-[1000]">
        <button onClick={() => setSelectedLayer("Streets")} className={`p-2 rounded-lg ${selectedLayer === "Streets" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
          <Map className="h-6 w-6" />
        </button>
        <button onClick={() => setSelectedLayer("Satellite")} className={`p-2 rounded-lg ${selectedLayer === "Satellite" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
          <Globe className="h-6 w-6" />
        </button>
        <button onClick={() => setSelectedLayer("Terrain")} className={`p-2 rounded-lg ${selectedLayer === "Terrain" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
          <Mountain className="h-6 w-6" />
        </button>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 -right-4 transform -translate-x-1/2 bg-black text-white p-3 rounded-full shadow-lg hover:bg-black z-[1000]"
      >
        <LocateFixed className="h-[10%]" />
      </button>
    </div>
  );
};

export default MapComponent;
