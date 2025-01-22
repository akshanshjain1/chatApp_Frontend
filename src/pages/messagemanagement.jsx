import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/adminlayout";
import RenderAttachment from "../components/shared/renderattachment";
import Table from "../components/shared/table";
import { useErrors } from "../hooks/hook";
import { fileformat, transformimage } from "../libs/features";
import { useAdminAllmessagesQuery } from "../redux/api/api";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
        const {attachments}=params.row;
        return <>{attachments.length>0 ? (attachments.map((i)=>{
            const url=i.url;
            const file=fileformat(url);
            return <Box>
                <a href={url} download={true} target="_blank" style={{color:'black'}}>
                    {RenderAttachment(file,url)}
                </a>
            </Box>
        })):(<Typography>No Attachments</Typography>)}</>}
    
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "SendBy",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={'row'}spacing={'0.5rem'}>
        <Avatar src={params.row.sender.avatar} alt={params.row.sender.name} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupchat",
    headerName: "Groups Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
function MessageManagement() {
  const {data,isLoading,isError,error}=useAdminAllmessagesQuery()
 
  useErrors([{isError,error}])
  
  const [rows, setrows] = useState([]);
  useEffect(() => {
    if(data){
      setrows(
        data.transformmessages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformimage(i.sender.avatar, 50),
          },
          createdAt:moment(i.createdAt).format('MMMM Do YYYY,h:mm:ss a'),
          chat:i.chatid
        }))
      );
    }
  },[data]);
  return (
    <AdminLayout>
       {
        isLoading?(<Skeleton/>):<Table heading={"All Messages"} columns={columns} rows={rows} />
    
      }    </AdminLayout>
  );
}
export default MessageManagement;
