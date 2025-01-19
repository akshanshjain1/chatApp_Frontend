import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncmutation = (mutationHook) => {
  const [isloading, setisloading] = useState(false);
  const [mutate] = mutationHook();
const [data,setdata]=useState(null)
  const executemutation = (toastmessage, ...args) => {
    setisloading(true);
    const toastid = toast.loading(toastmessage || "Updating data....");

    try {
      mutate(...args).then((res) => {
        if (res.data) {
          toast.success(res.data.message || "Updation Done",{
            id:toastid
          });
          setdata(res.data)
        } else {
          toast.error(res?.error?.data?.message || "Something went wrong",{
            id:toastid
          });
          
        }
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setisloading(false);
    }
  };
  return [ executemutation, isloading, data ];
};

const useSocketEvents=(socket,handlers)=>{
    useEffect(()=>{
      
      Object.entries(handlers).forEach(([event,handler])=>{
        socket.on(event,handler)
      });

      return ()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
          socket.off(event,handler)
      }
    )

    } },[socket,handlers])
}

export { useErrors,useAsyncmutation,useSocketEvents };
