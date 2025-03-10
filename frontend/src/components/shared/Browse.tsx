import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Job from "./Job";
import { setSearchedQuery, setSelectedCategory } from "@/redux/jobSlice";
import useGetJobs from "@/hooks/useGetJobs";
import { Briefcase, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/app/store";

const Browse = () => {
  const dispatch = useDispatch();
  const { allJobs, selectedCategory } = useSelector((state:RootState) => state.job);
  const [view, setView] = useState("grid"); // 'grid' or 'list'
  // Use the custom hook to fetch jobs based on filters
  useGetJobs();

  // This component no longer needs to filter jobs locally
  // Jobs are filtered server-side through the API call in useGetJobs

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  // Array of categories (ensure these match backend exactly)
  const categories = [
    "All",
    "Information Technology",
    "Business & Finance",
    "Hospitality & Tourism",
    "Education & Teaching",
    "Web Developer",
    "Data Scientist",
    "Accountant",
    "Graphic Designer",
  ];

  // Filter jobs based on selected category
  const filteredJobs = selectedCategory && selectedCategory !== "All"
    ? allJobs.filter((job) => job.category === selectedCategory)
    : allJobs;

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-6 mx-auto sm:px-8 lg:px-10 max-w-7xl">
        {/* Header section */}
        <div className="mb-8">
          <div className="p-8 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/40">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    {selectedCategory && selectedCategory !== "All"
                      ? `${selectedCategory} Jobs`
                      : "All Job Listings"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Find your next career opportunity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  Filters
                </Button>

                <div className="flex p-1 border border-gray-200 rounded-lg dark:border-gray-700">
                  <button
                    className={`p-1.5 rounded ${
                      view === "grid"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-1.5 rounded ${
                      view === "list"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setView("list")}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category filter buttons */}
            <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                    onClick={() => dispatch(setSelectedCategory(category))}
                    className="px-4 py-2 text-xs rounded-lg"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs section with view toggle */}
        {filteredJobs.length > 0 ? (
          <div
            className={`grid gap-6 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredJobs.map((job) => (
              <Job key={job._id} job={job} viewMode={view} />
            ))}
          </div>
        ) : (
          <Card className="w-full overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-xl">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <div className="w-full p-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <Briefcase className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  No Jobs Found
                </h3>
                <p className="max-w-md mx-auto mb-6 text-gray-500 dark:text-gray-400">
                  We couldn't find any positions matching your criteria. Try adjusting your search or check back soon.
                </p>
                <Button 
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={() => dispatch(setSelectedCategory("All"))}
                >
                  Clear Filters
                </Button>
              </div>
              <div className="w-full p-6 bg-blue-50 dark:bg-blue-900/10">
                <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Can't find what you're looking for?
                  </span>
                  <Button variant="link" className="text-blue-600 dark:text-blue-400">
                    Set up job alerts → 
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Browse;
