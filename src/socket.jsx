import { createContext, useContext, useMemo } from 'react';
import io from 'socket.io-client';
import { server } from './constants/config';
const SocketContext=createContext();
 const getSocket=()=>useContext(SocketContext)
const SocketProvider=({children})=>{
    
    
    const socket=useMemo(()=>io(server,{withCredentials:true,transports:["websocket"]}))
    socket.on("connect_error", (err) => {

        console.log(err)
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);
      
        // some additional description, for example the status code of the initial HTTP response
        console.log(err.description);
      
        // some additional context, for example the XMLHttpRequest object
        console.log(err.context);
      });

    return( 
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>)
}
export { getSocket, SocketProvider };

