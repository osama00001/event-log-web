import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { useToast } from "@/components/ui/use-toast";
import OperationsLog from "@/components/OperationsLog";
import Profile from "./Profile";
import { User } from "lucide-react";
import { useAuth } from "@/components/hooks/userAuth"
import { Link } from "react-router-dom";

const Index = () => {
  const {auth,logoutAuthUser} = useAuth()
  let {user} = auth
  const [showProfile, setShowProfile] = useState(false);
  const { toast } = useToast();

 const handleLogout =()=>{
  logoutAuthUser()
 }
  return (
    
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img 
                src="/edsp-logo.svg" 
                alt="EDSP Solutions" 
                className="h-12 md:h-14" 
              />
              <Link to = "/">
              <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
                <span className="text-black">EDSP</span>{" "}
                <span className="text-primary">Solutions</span>{" "}
                <span className="text-black">Network Control</span>
              </h1>
              </Link>
            </div>
            { auth?.accessToken && (
              <div className="flex items-center gap-4">
                <span className="text-sm md:text-base text-gray-700">
                  Welcome, {user?.userName?user?.userName:user?.email?.split("@")[0]}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowProfile(!showProfile)}}
                  className="text-sm md:text-base"
                >
                  {!showProfile? <User className="w-4 h-4 mr-2" />:''}
                  {!showProfile?'Profile':"Operation logs"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick = {handleLogout}
                  className="text-sm md:text-base"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:py-8 md:px-8">
        {!(auth?.accessToken) ? (
          <Card className="max-w-md mx-auto p-6">
            <LoginForm />
          </Card>
        ) : showProfile ? (
          <Profile />
        ) : (
          <OperationsLog userRole={user?.role} userName={user?.fulllName} />
        )}
      </main>
    </div>
  );
};

export default Index;