import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ mediaStream ,mute=false}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && mediaStream) {
      audioRef.current.srcObject = mediaStream;
      audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
    }

    
    return () => {
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
    };
  }, [mediaStream]);

  return (
    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
      <audio ref={audioRef}  muted={mute}  />
    </div>
  );
};

export default AudioPlayer;
