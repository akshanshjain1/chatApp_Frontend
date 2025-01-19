import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/adminlayout";
import Table from "../components/shared/table";
import { useErrors } from "../hooks/hook";
import { transformimage } from "../libs/features";
import { useAdminAllusersQuery } from "../redux/api/api";
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
    width: 150,
    renderCell: (params) => (
      <Avatar src={params.row.avatar} alt={params.row.name} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];
function UserManagement() {

  const {data,isLoading,isError,error}=useAdminAllusersQuery()
  
  useErrors([{isError,error}])
  const [rows, setrows] = useState([]);
 
  useEffect(() => {
    if(data){
      
    setrows(
      data.transformusers.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformimage(i.avatar, 50),
        friends:i.friendscount,
        groups:i.groupcount
      }))
    );
 } }, [data]);
 
  return (
    <AdminLayout>
      {
        isLoading?(<Skeleton/>):<Table heading={"All Users"} columns={columns} rows={rows} />
    
      }
      </AdminLayout>
  );
}
export default UserManagement;
