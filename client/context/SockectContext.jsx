import { useAppStore } from "@/store";
import { createContext,useContext, useEffect,useRef } from "react"

const SocketContext=createContext(null);

export const useSocket=()=>{
    return useContext(SocketContext);
};

export const SocketProvider=({children})=>{
    const socket=useRef();
    const {userInfo}=useAppStore();
    useEffect(()=>{
if(userInfo){
    socket.current=io()
}
    },[userInfo])
};