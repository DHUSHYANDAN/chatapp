import { useAppStore } from "@/store";  
import { useEffect } from "react";  
import { useNavigate } from "react-router-dom";  
import { toast } from "sonner";  

const Chat = () => {  
  const { userInfo } = useAppStore();  
  const navigate = useNavigate();  

  useEffect(() => {  
    if (!userInfo.profileSetup) {  
      toast("Please set up your profile to continue.");  
      navigate("/profile"); // Navigate to the profile setup page  
    }  
  }, [userInfo, navigate]);  

  return (  
    <div>  
      <h1>Chat </h1>  
     
    </div>  
  );  
};  

export default Chat;