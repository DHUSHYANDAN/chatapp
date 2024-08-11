import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";


const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
const fileInputRef=useRef(null);


  useEffect(() => {

    if (userInfo.ProfileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    
    }
  }, [userInfo]);
  



  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true; 
  };
  
  const saveChanges = async () => {
    if (validateProfile()) {
     
    try{
      const response=await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true}

      );
      if(response.status===200 && response.data){
        setUserInfo({...response.data});
        toast.success("profile updated successfully.");
        navigate('/chat');
      }

    } catch(error){
        console.log(error)
    }
    }
  };      

  const handleNavigate=()=>{
    if(userInfo.ProfileSetup){
      navigate('/chat');
    }else{
      toast.error("please setup profile.");
    }
  }
const handleFileInputClick =()=>{
  fileInputRef.current.click();
}
const handleImageChange =async (event)=>{
  const file  =event.target.files[0];
   console.log({file});
   if (file){
    const formData = new FormData();
    formData.append("profile-image",file);
    // const response=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{
    //   withCredentials:true,
    // });
    // if(response.status===200 && response.data.image){
    //   setUserInfo({...userInfo,image: response.data.image });
    //   toast.success("image updated successfully.");
    // }
  
   }
};

const handleDeleteImage =async ()=>{};


  return (
    <div className="h-[100vh] flex items-center justify-center flex-col gap-10 bg-[#1b1c24]">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full" onClick={image ? handleDeleteImage: handleFileInputClick}>
                {image ? (
                  <FaTrash
                    className="text-white text-3xl cursor-pointer"
                    onClick={() => setImage(null)}
                  />
                ) : (
                  <FaPlus
                    className="text-white text-3xl cursor-pointer"
                    onClick={() => {/* Add image upload logic here */}}
                  />
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image " accept=".png, .jpg, .jpeg, .svg, .webp"/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full ">
            <Button className="w-full h-16 bg-indigo-600 hover:bg-indigo-900 transition-all duration-300" onClick={saveChanges}>
                Save Changes
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
