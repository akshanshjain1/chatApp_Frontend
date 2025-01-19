import { Avatar, Skeleton, Stack } from "@mui/material";
import { React, useEffect, useState } from "react";
import AdminLayout from "../components/layout/adminlayout";
import AvatarCard from "../components/shared/avatarcard";
import Table from "../components/shared/table";
import { useErrors } from "../hooks/hook";
import { transformimage } from "../libs/features";
import { useAdminAllchatsQuery } from "../redux/api/api";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "totalmembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalmessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "groupchat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "creater",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Avatar alt={params.row.creater.name} src={params.row.creater.avatar} />
        <span>{params.row.creater.name}</span>
      </Stack>
    ),
  },
];
function ChatManagement() {

  const {data,isLoading,isError,error}=useAdminAllchatsQuery()
  
  useErrors([{isError,error}])
  const [rows, setrows] = useState([]);
  useEffect(() => {
    if(data){
    setrows(
      data.transformchats.map((i) => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map((i) => transformimage(i, 50)),
        members: i.members.map((i) => transformimage(i.avatar, 50)),
        creater: {
          name: i.creater.name,
          avatar: transformimage(i.creater.avatar, 50),
        },
      }))
    );
  }}, [data]);
  return (
    <AdminLayout>
      {
        isLoading?(<Skeleton/>):<Table heading={"All Chats"} columns={columns} rows={rows} />
    
      }
    </AdminLayout>
  );
}

export default ChatManagement;
