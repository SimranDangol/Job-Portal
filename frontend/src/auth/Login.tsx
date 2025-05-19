import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { setLoading, setUser } from "@/redux/authSlice";

// type define
type LoginInputState = {
  email: string;
  password: string;
  role: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    //Basic Validation
    if (!input.email || !input.password || !input.role) {
      toast.error("All fields are required");
      return;
    }

    // Password Validation(6 characters minimum)
    if (input.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post("/api/v1/user/login", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        const token =
          response.data.data.token || response.data.data.accessToken;

        localStorage.setItem("token", token);

        if (!userData.savedJobs) {
          userData.savedJobs = [];
        }

        console.log("User Data with saved jobs:", userData);
        dispatch(setUser(userData));
        toast.success("Logged in successfully");
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Invalid credentials ");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginSubmitHandler} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={input.email}
                onChange={changeEventHandler}
                className="w-full h-10 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="w-full h-10 pr-10 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">
                Role
              </Label>
              <Select
                value={input.role}
                onValueChange={(value) => setInput({ ...input, role: value })}
              >
                <SelectTrigger className="h-10 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job seeker">Job Seeker</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-4 text-sm text-gray-600">
          <p>
            {"Don't have an account? "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
