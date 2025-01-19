import React from "react";
import { transformimage } from "../../libs/features";
import { FileOpen } from "@mui/icons-material";
function RenderAttachment({file,url}){
    
    if(file==='video')
        return <video src={url} preload="none" width={'200px'} controls/>
      
    else if(file ==="image"){
        
        return <img src={transformimage(url,200)} alt="Attachment" width={'200px'} height={'150px'} style={{
            objectFit:'contain'
        }}/> }
    else if(file==='audio')
        return  <audio src={url} preload="none" controls/> 
    else return <FileOpen/>     
}
export default RenderAttachment