import { useAppStore } from "@/store";

const Profile = () => {
  const { userInfo } = useAppStore();
  // const email = userInfo.id;

  return (
    <div>
      <h1>Profile</h1>
      <div>Email: {userInfo.id}</div>
    </div>
  );
}

export default Profile;
