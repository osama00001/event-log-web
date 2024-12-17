import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateProfile, getProfile } from "@/api/auth";
import { Loader2, Save, User, Mail, Phone, Clock, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface ProfileFormProps {
  user: string;
  token: string;
}

const ProfileForm = ({ user, token }: ProfileFormProps) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
   
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile(token);
        if (profile?.user) {
          setUserName(profile.user.userName || "");
          setEmail(profile.user.email || "");
          setPhoneNumber(profile.user.phoneNumber || "");
          setRole(profile.user.role || "operator");
          if (profile.user.updatedAt) {
            setLastSaved(new Date(profile.user.updatedAt));
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user, token, toast]);

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?\d+$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateNonEmptyInput = (input: string) => {
    return input.trim().length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (!validateNonEmptyInput(userName)) {
      toast({
        title: "Invalid Username",
        description: "Please enter a valid username",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateProfile({ userName, email, phoneNumber },token);
      if (response.status === "success") {
        setLastSaved(new Date());
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <CardDescription>
                Manage your account settings and profile information
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 self-start">
              <Shield className="h-3 w-3" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                {lastSaved && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last saved: {lastSaved.toLocaleString()}
                  </div>
                )}
              </div>
              <Button type="submit" disabled={isSaving} className="gap-2 w-full sm:w-auto">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;