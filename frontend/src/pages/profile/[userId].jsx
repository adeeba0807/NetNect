import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";

const UserProfile = () => {
  const router = useRouter();
  const { userId } = router.query;
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.auth.profile);

  useEffect(() => {
    if (userId) {
      dispatch(getAboutUser({ userId }));
    }
  }, [userId, dispatch]);

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{userProfile.name}</h2>
      <p>Email: {userProfile.email}</p>
      <p>Bio: {userProfile.bio}</p>
      <p>Location: {userProfile.location}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default UserProfile;