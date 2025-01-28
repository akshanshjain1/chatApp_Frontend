import { useEffect, useState } from "react";

const Timer = ({ startTime }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000)); // Update timer every second
      }, 1000);
  
      return () => clearInterval(timer); // Cleanup on unmount
    }, [startTime]);
  
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
  
    return (
      <div style={{color:'blueviolet'}}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
    );
  };

export default Timer