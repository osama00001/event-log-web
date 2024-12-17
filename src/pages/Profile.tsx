import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";
import { getProfile } from "@/api/auth";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/hooks/userAuth"

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { toast } = useToast();
  const {auth} = useAuth()
  let {user} = auth
  let userToken =auth.accessToken

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const userId = localStorage.getItem('userId') || 'dummy-user-id';
  //       const token = localStorage.getItem('token') || 'dummy-token';
  //       const profileData = await getProfile(token);
  //       setProfile(profileData);
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to load profile",
  //         variant: "destructive",
  //       });
  //     }
  //   };

  //   fetchProfile();
  // }, [toast]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <Card className="max-w-md mx-auto p-6">
        {auth.accessToken?  <ProfileForm user={user} token={auth.accessToken} />:""}
      </Card>
    </div>
  );
};

export default Profile;