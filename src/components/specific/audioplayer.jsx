import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ mediaStream }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && mediaStream) {
      audioRef.current.srcObject = mediaStream;
      audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
    }

    // Cleanup on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
    };
  }, [mediaStream]);

  return (
    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
      <audio ref={audioRef} controls  />
    </div>
  );
};

export default AudioPlayer;
