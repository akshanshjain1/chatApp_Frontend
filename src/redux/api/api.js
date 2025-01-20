import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/`}),
  tagTypes: ["Chat", "User", "Message", "Dashboard","Dashboard-Users","Dashboard-Chats","Dashboard-Messages"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/mychats",
        credentials: "include",
      }),
     
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendfriendrequest: builder.mutation({
      query: (data) => ({
        url: "user/sendfriendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getnotification: builder.query({
      query: () => ({
        url: "user/getmynotifications",
        credentials: "include",
      }),
      keepUnusedDataFor: 0, // no caching
    }),
    acceptfriendrequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptfriendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    getchatdetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += `?populate=true`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getoldmessages: builder.query({
      query: ({ chatId, page = 1 }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",

      }),
      keepUnusedDataFor: 0,
    }),
    sendattachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    getmygroups: builder.query({
      query: () => ({
        url: "chat/mygroups",
        credentials: "include",
      }),
      providesTags: ["Chat"], // no caching
    }),
    availablefriends: builder.query({
      query: (chatId) => {
        let url = `user/getmyfriends`;
        if (chatId) url += `?chatid=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["User"],
    }),
    makeNewgroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),
    renamegroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),
    addmember: builder.mutation({
      query: ({ chatId, members }) => ({
        url: "chat/addmember",
        method: "PUT",
        credentials: "include",
        body: { chatid: chatId, members },
      }),
      invalidatesTags: ["Chat"],
    }),
    removemember: builder.mutation({
      query: ({ ChatId, UserId }) => ({
        url: "chat/removemember",
        method: "DELETE",
        credentials: "include",
        body: { chatid: ChatId, userId: UserId },
      }),
      invalidatesTags: ["Chat"],
    }),
    deletegroup: builder.mutation({
      query: ({ chatId }) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    leavegroup: builder.mutation({
      query: ({ chatId }) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    adminstats: builder.query({
      query: () => {
        return {
          url: `admin/stats`,
          credentials: "include",
        };
      },
      providesTags: ["Dashboard"],
    }),
    adminAllusers: builder.query({
        query: () => {
          return {
            url: `admin/users`,
            credentials: "include",
          };
        },
        providesTags: ["Dashboard-Users"],
      }),
      adminAllchats: builder.query({
        query: () => {
          return {
            url: `admin/chats`,
            credentials: "include",
          };
        },
        providesTags: ["Dashboard-Chats"],
      }),adminAllmessages: builder.query({
        query: () => {
          return {
            url: `admin/messages`,
            credentials: "include",
          };
        },
        providesTags: ["Dashboard-Messages"],
      }),
  }),
});
export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendfriendrequestMutation,
  useGetnotificationQuery,
  useAcceptfriendrequestMutation,
  useGetchatdetailsQuery,
  useGetoldmessagesQuery,
  useSendattachmentsMutation,
  useGetmygroupsQuery,
  useAvailablefriendsQuery,
  useMakeNewgroupMutation,
  useRenamegroupMutation,
  useAddmemberMutation,
  useRemovememberMutation,
  useDeletegroupMutation,
  useLeavegroupMutation,
  useAdminstatsQuery,
  useAdminAllusersQuery,
  useAdminAllchatsQuery,
  useAdminAllmessagesQuery

} = api;
