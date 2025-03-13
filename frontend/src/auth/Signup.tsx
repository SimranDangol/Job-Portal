import  { ChangeEvent, FormEvent, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/app/store";
import { setLoading } from "@/redux/authSlice";

// Type define
type SignupInputState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState<SignupInputState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state: RootState) => state.auth);

  // Change event handler
  const ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInput((prev) => ({ ...prev, [id]: value }));
  };

  // Submit handler
  const signupSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !input.fullName ||
      !input.email ||
      !input.password ||
      !input.phoneNumber ||
      !input.role
    ) {
      toast.error("All fields are required");
      return;
    }

    // Password validation (minimum 6 characters)
    if (input.password.length < 6) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/register`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Account created successfully");
        navigate("/login");
      }
    } catch (error) {
      // Checking if error is an AxiosError
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create account"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md p-4 bg-white border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-xl font-bold text-gray-900">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signupSubmitHandler} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={input.fullName}
                onChange={ChangeEventHandler}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                onChange={ChangeEventHandler}
                value={input.email}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                onChange={ChangeEventHandler}
                value={input.phoneNumber}
                placeholder="+977 0000000000"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={input.password}
                  onChange={ChangeEventHandler}
                  placeholder="••••••••"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <Select
                value={input.role}
                onValueChange={(value) => setInput({ ...input, role: value })}
              >
                <SelectTrigger>
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
              disabled={loading}
              className="w-full text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Please wait
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-3">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
