import { useEffect, useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Category from "./Category";
import LatestJobs from "./LatestJobs";
import { setSearchedQuery } from "@/redux/jobSlice";
import { RootState } from "@/redux/app/store";

const Home: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  if (user?.role === "recruiter") return null;

  const searchJobHandler = () => {
    if (query.trim()) {
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchJobHandler();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Search */}
      <div className="px-4 py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
            <span className="block">Search, Apply &</span>
            <span className="block text-blue-600 dark:text-blue-400">
              Get Your Dream Job
            </span>
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Discover thousands of job opportunities with all the information you
            need.
          </p>

          {/* Search Box with Button inside */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mx-auto">
              <Input
                type="text"
                placeholder="Find your dream job..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-grow px-6 py-3 text-lg border border-gray-300 rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400"
                style={{ boxShadow: "none" }}
              />
              <Button
                onClick={searchJobHandler}
                className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Reduced padding */}
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <Category />
        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="px-4 py-16 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <LatestJobs />
          <div className="mt-12 text-center">
            <Button
              onClick={() => {
                navigate("/jobs");
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100); // Slight delay to ensure navigation happens first
              }}
              className="px-10 py-6 text-lg font-medium text-white bg-black rounded-full hover:bg-slate-950 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              View All Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Start Your New Career?
          </h2>
          <p className="mb-10 text-xl text-gray-800 dark:text-gray-200">
            Create your profile now and let employers find you
          </p>
          <Button
            onClick={() => {
              navigate("/register");
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 100); // Slight delay to ensure navigation happens first
            }}
            className="px-10 py-6 text-lg font-medium text-blue-600 transition-all bg-white rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;



