import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/app/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu, X, Bookmark } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    setIsDropdownOpen(false);
    try {
      const res = await axios.post(
        "/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  const userRole = user?.role?.trim().toLowerCase();
  const isJobSeeker = userRole === "job seeker";
  const isRecruiter = userRole === "recruiter";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-gray-800 dark:text-gray-100"
        >
          Job<span className="text-red-500">Hunt</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden space-x-6 lg:flex">
          {!user || isJobSeeker ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                Jobs
              </NavLink>
              <NavLink
                to="/browse"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                Browse
              </NavLink>
            </>
          ) : null}

          {user && isRecruiter && (
            <>
              <NavLink
                to="/admin/companies"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                Companies
              </NavLink>
              <NavLink
                to="/admin/jobs"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                Manage Jobs
              </NavLink>
            </>
          )}
        </div>

        {/*  User Profile */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Button variant="outline">
                <NavLink to="/login">Login</NavLink>
              </Button>
              <Button className="bg-red-500 hover:bg-red-600">
                <NavLink to="/register">Signup</NavLink>
              </Button>
            </>
          ) : (
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src={user.profilePicture || "/default-avatar.png"}
                  />
                  <AvatarFallback>
                    {user?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 p-2 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                {/* Profile link */}
                {isJobSeeker && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="flex items-center px-3 py-2 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="mr-1" size={16} />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/saved-jobs");
                      }}
                      className="flex items-center px-3 py-2 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Bookmark className="mr-1" size={16} />
                      Saved Jobs
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                {/* Logout for all users */}
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className="flex items-center px-3 py-2 transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-1" size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col items-center py-4 space-y-4 lg:hidden">
          {!user || isJobSeeker ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </NavLink>
              <NavLink
                to="/browse"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </NavLink>
            </>
          ) : null}

          {/* Show Manage Jobs link if user is recruiter */}
          {user && isRecruiter && (
            <NavLink
              to="/admin/jobs"
              className={({ isActive }) =>
                `nav-link ${
                  isActive
                    ? "text-red-500 font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Manage Jobs
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
