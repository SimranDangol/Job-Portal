import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Job from "./Job";
import {
  setSearchedQuery,
  setSelectedCategory,
  setSelectedLocation,
  setSelectedIndustry,
} from "@/redux/jobSlice";
import useGetJobs from "@/hooks/useGetJobs";
import { Briefcase, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/app/store";

const Browse = () => {
  const dispatch = useDispatch();
  const {
    allJobs,
    selectedCategory,
    selectedLocation,
    selectedIndustry,
    searchedQuery,
  } = useSelector((state: RootState) => state.job);

  const [view, setView] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { loading } = useGetJobs();

  const clearAllFilters = () => {
    dispatch(setSearchedQuery(""));
    dispatch(setSelectedCategory("All"));
    dispatch(setSelectedLocation("All"));
    dispatch(setSelectedIndustry("All"));
  };

  // Debug logging
  useEffect(() => {
    console.log("Browse component mounted with search query:", searchedQuery);
    console.log("Selected category:", selectedCategory);
    console.log("Selected location:", selectedLocation);
    console.log("Selected industry:", selectedIndustry);

    // Only clean up on unmount if we're actually leaving the app
    return () => {
      // We'll only clear the search query if navigating away from the search results
      // This prevents clearing when just refreshing or changing filters
      if (window.location.pathname !== "/browse") {
        dispatch(setSearchedQuery(""));
      }
    };
  }, [
    dispatch,
    searchedQuery,
    selectedCategory,
    selectedLocation,
    selectedIndustry,
  ]);

  const categories = [
    "All",
    "Information Technology",
    "Business & Finance",
    "Digital Marketing",
    "Education & Teaching",
    "Accounting",
    "Graphic Designer",
    "Sales",
  ];

  const filteredJobs =
    selectedCategory && selectedCategory !== "All"
      ? allJobs.filter((job) => job.category === selectedCategory)
      : allJobs;

  const searchInfo = searchedQuery
    ? `Search results for "${searchedQuery}"`
    : selectedCategory && selectedCategory !== "All"
    ? `${selectedCategory} Jobs`
    : "All Job Listings";

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* Header section */}
        <div className="mb-8">
          <div className="p-4 bg-white shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 rounded-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full sm:w-12 sm:h-12 dark:bg-blue-900/40">
                  <Briefcase className="w-5 h-5 text-blue-600 sm:w-6 sm:h-6 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl md:text-3xl dark:text-gray-100">
                    {searchInfo}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {searchedQuery &&
                      `Showing jobs matching "${searchedQuery}"`}
                    {!searchedQuery && "Find your next career opportunity"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
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
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
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
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 ${
                isFilterOpen ? "block" : "hidden md:block"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ||
                      (category === "All" && !selectedCategory)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => dispatch(setSelectedCategory(category))}
                    className="px-3 py-1 text-xs whitespace-nowrap rounded-lg sm:px-4 sm:py-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {searchedQuery && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm"
                    onClick={() => dispatch(setSearchedQuery(""))}
                  >
                    Clear Search "{searchedQuery}"
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <Card className="w-full p-4 text-center sm:p-6 md:p-8">
            <CardContent>
              <p>Loading jobs...</p>
            </CardContent>
          </Card>
        )}

        {/* Jobs section */}
        {!loading &&
          (filteredJobs.length > 0 ? (
            <div
              className={`grid gap-4 sm:gap-6 ${
                view === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredJobs.map((job) => (
                <Job key={job._id} job={job} viewMode={view} />
              ))}
            </div>
          ) : (
            <Card className="w-full overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="w-full p-4 text-center sm:p-6 md:p-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full sm:w-20 sm:h-20 sm:mb-6 bg-blue-50 dark:bg-blue-900/20">
                    <Briefcase className="w-8 h-8 text-blue-500 sm:w-10 sm:h-10 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-800 sm:mb-3 sm:text-2xl dark:text-gray-200">
                    No Jobs Found
                  </h3>
                  <p className="max-w-md mx-auto mb-4 text-sm text-gray-500 sm:mb-6 sm:text-base dark:text-gray-400">
                    {searchedQuery
                      ? `We couldn't find any positions matching "${searchedQuery}".`
                      : selectedCategory && selectedCategory !== "All"
                      ? `We couldn't find any ${selectedCategory} positions.`
                      : selectedLocation &&
                        selectedLocation !== "All" &&
                        selectedIndustry &&
                        selectedIndustry !== "All"
                      ? `We couldn't find any ${selectedIndustry} positions in ${selectedLocation}.`
                      : selectedLocation && selectedLocation !== "All"
                      ? `We couldn't find any positions in ${selectedLocation}.`
                      : selectedIndustry && selectedIndustry !== "All"
                      ? `We couldn't find any ${selectedIndustry} positions.`
                      : "We couldn't find any positions matching your criteria."}
                    Try adjusting your search or check back soon.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {searchedQuery && (
                      <Button
                        className="px-3 py-1 text-xs text-white sm:px-4 sm:py-2 sm:text-sm bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={() => dispatch(setSearchedQuery(""))}
                      >
                        Clear Search
                      </Button>
                    )}
                    {selectedCategory && selectedCategory !== "All" && (
                      <Button
                        className="px-3 py-1 text-xs text-white sm:px-4 sm:py-2 sm:text-sm bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={() => dispatch(setSelectedCategory("All"))}
                      >
                        Clear Category
                      </Button>
                    )}
                    {selectedLocation && selectedLocation !== "All" && (
                      <Button
                        className="px-3 py-1 text-xs text-white sm:px-4 sm:py-2 sm:text-sm bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={() => dispatch(setSelectedLocation("All"))}
                      >
                        Clear Location
                      </Button>
                    )}
                    {selectedIndustry && selectedIndustry !== "All" && (
                      <Button
                        className="px-3 py-1 text-xs text-white sm:px-4 sm:py-2 sm:text-sm bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={() => dispatch(setSelectedIndustry("All"))}
                      >
                        Clear Industry
                      </Button>
                    )}
                    {(selectedCategory !== "All" ||
                      selectedLocation !== "All" ||
                      selectedIndustry !== "All") && (
                      <Button
                        className="px-3 py-1 text-xs text-white sm:px-4 sm:py-2 sm:text-sm bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-full p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/10">
                  <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center">
                    <span className="text-xs font-medium text-gray-600 sm:text-sm dark:text-gray-300">
                      Can't find what you're looking for?
                    </span>
                    <Button
                      variant="link"
                      className="text-sm text-blue-600 dark:text-blue-400"
                    >
                      Set up job alerts →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Browse;
