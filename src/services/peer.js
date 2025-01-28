class PeerService{
    constructor(){
        console.log("1")
        if(!this.peer){
            console.log("new peer created")
            this.peer=new RTCPeerConnection({
                iceServers:[
                    {
                        urls:
                            "stun:stun.l.google.com:19302"
                            
                    
                    }
                ]
            })
        }
    }

   async getOffer(){
        if(this.peer){
            const offer=await this.peer.createOffer()
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return this.peer.localDescription;
        }
    }

    async getAnswer(offer){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const ans=await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return this.peer.localDescription;
        }
    }

    async setLocalDescription(ans){
        if(this.peer){
            
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
        }
    }
    
        async setIceCandidate(candidate){
            if(this.peer){
                await this.peer.addIceCandidate(new RTCIceCandidate(candidate))
            }
        }

        setlocalstream(stream){
            if(this.peer){
                stream.getTracks().forEach(track=>{
                    this.peer.addTrack(track,stream)
                  })
            }
        }

        closePeer(){
            if(this.peer){
                this.peer.close();
                this.peer=null; 
            }
        }

        
}

export default new PeerService()

// const Peerconnection=(function(){
//     let peerconnection;
//     const createPeerconnection=()=>{
//       peerconnection=new RTCPeerConnection();
  
//     }
  
//     return {
//       getInstance:()=>{
//         if(!peerconnection){
//           const config={
//             iceServers:[
//               {
//                 urls: "stun:stun.l.google.com:19302",
//               }
//             ]
//           }
//           peerconnection=new RTCPeerConnection(config);
//           // add local streams to peer connection;
  
//           mystream?.getTracks().forEach(track=>{
//             peerconnection.addTrack(track,mystream)
//           })
  
//           peerconnection.ontrack=function(event){
//             console.log("GOT streams")
//             setremotestream(event.streams[0])
//           }
//           //listen to remote stream and add to peer connection;
//           // listen to ice candidate;
  
//           peerconnection.onicecandidate=function(event){
//               if(event.candidate){
//                 let userid;
//                 if(user._id.toString()===IncomingUserId)
//                   userid=OutgoingUserId;
//                 else userid=IncomingUserId
//                 socket.emit(ICE_CANDIDATE,{candidate:event.candidate,userid})
//               }
//           }
  
  
//         };
//         return peerconnection;
  
//       }
//     }
  
//   })()