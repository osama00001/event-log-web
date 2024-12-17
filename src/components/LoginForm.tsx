import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {handleRegistration,userLogin} from "@/api/auth"
import { useAuth } from "@/components/hooks/userAuth"
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginAuthUser } = useAuth();
  const [pageDefault,setPageDefault]= useState('register')
  const [role, setRole] = useState<"operator" | "control">("operator");
  const { toast } = useToast();
  const [loader,setLoader] =useState({status:false,type:''})
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email)
;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    setLoader({status:true,type:'login'})

    let payload = {email,password,role}
    const response =await userLogin(payload)
    
    if(response && response?.status !== 'success'){
      setLoader({status:false,type:'login'})
      toast({
        title: response.status,
        description: response.message || "An error occurred",
        variant: "destructive",
      })
      return;
    }
    if(response && response?.status == 'success'){
      setLoader({status:false,type:'login'})
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      setPageDefault('login')
      console.warn()
      loginAuthUser(response.accessToken, '');
    }
    
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!userName.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    setLoader({status:true,type:'register'})
    let payload = {email, password, role, userName}
    let response = await handleRegistration(payload);
    if (response && response?.status !== 'success') {
      setLoader({status:false,type:'register'})
      toast({
        title: response.status,
        description: response.message || "An error occurred",
        variant: "destructive",
      })
      return;
      
    }
    if(response && response?.status == 'success'){
    setLoader({status:false,type:'register'})
    toast({
      title: response.status,
      description: response.message || "Operation performed",
      variant: "default",
    })
  }

  };

  return (
    <Tabs defaultValue={pageDefault} value={pageDefault} onValueChange={setPageDefault} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            <div className="text-right">
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-sm"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={(value: "operator" | "control") => setRole(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operator" id="login-operator" />
                <Label htmlFor="login-operator">Operator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="control" id="login-control" />
                <Label htmlFor="login-control">Control Engineer</Label>
              </div>
            </RadioGroup>
          </div>
          {(loader.status==true && loader.type==="login") &&<div className="w-10 h-10 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={(value: "operator" | "control") => setRole(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operator" id="reg-operator" />
                <Label htmlFor="reg-operator">Operator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="control" id="reg-control" />
                <Label htmlFor="reg-control">Control Engineer</Label>
              </div>
            </RadioGroup>
          </div>
          {(loader.status==true && loader.type==="register") &&<div className="w-10 h-10 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>}

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;