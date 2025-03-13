import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setSelectedIndustry, setSelectedLocation } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/redux/app/store";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Kathmandu",
      "Lalitpur",
      "Bhaktapur",
      "Pokhara",
      "Butwal",
      "Chitwan",
      "Biratnagar",
    ],
  },
  {
    filterType: "Industry",
    array: [
      "Information Technology",
      "Business & Finance",
      "Digital Marketing",
      "Education & Teaching",
      "Accounting",
      "Graphic Designer",
      "Sales",
    ],
  },
];

const FilterCard: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedLocation, selectedIndustry} = useSelector(
    (state: RootState) => state.job
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Location: true,
    Industry: true,
  });
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  // Function to get count of matching jobs
  // const getMatchingJobsCount = (filterType: string, value: string) => {
  //   if (value === "All") return allJobs.length;

  //   return allJobs.filter((job) => {
  //     if (filterType === "Location") {
  //       return (
  //         job.location === value &&
  //         (selectedIndustry === "All" || job.industry === selectedIndustry)
  //       );
  //     } else if (filterType === "Industry") {
  //       return (
  //         job.industry === value &&
  //         (selectedLocation === "All" || job.location === selectedLocation)
  //       );
  //     }
  //     return true;
  //   }).length;
  // };

  // Function to handle filter change (Location/Industry)
  const handleFilterChange = (value: string, filterType: string) => {
    if (filterType === "Location") {
      dispatch(setSelectedLocation(value));
      if (value !== "All") {
        dispatch(setSelectedIndustry("All")); // Reset Industry filter
      }
    } else if (filterType === "Industry") {
      dispatch(setSelectedIndustry(value));
      if (value !== "All") {
        dispatch(setSelectedLocation("All")); // Reset Location filter
      }
    }
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    dispatch(setSelectedLocation("All"));
    dispatch(setSelectedIndustry("All"));
  };

  // Function to clear specific filter
  const clearFilter = (filterType: string) => {
    if (filterType === "Location") {
      dispatch(setSelectedLocation("All"));
    } else if (filterType === "Industry") {
      dispatch(setSelectedIndustry("All"));
    }
  };

  // Function to toggle expanded state for sections
  const toggleSection = (section: string) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get active filters for display
  const activeFilters = {
    Location: selectedLocation !== "All" ? selectedLocation : "",
    Industry: selectedIndustry !== "All" ? selectedIndustry : "",
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="w-full mb-4 md:hidden">
        <Button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          variant="outline"
          className="justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Card */}
      <Card
        className={`bg-white dark:bg-gray-800 shadow-md border-0 transition-all duration-300 md:block ${
          isMobileExpanded ? "block" : "hidden"
        }`}
      >
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Filter Jobs
            </CardTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(activeFilters).map(([type, value]) =>
                value ? (
                  <Badge
                    key={type}
                    className="text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {value}
                    <button
                      className="ml-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                      onClick={() => clearFilter(type)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <ScrollArea
            className="max-h-[calc(100vh-200px)] pr-3 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#5b5b5b #f0f0f0",
            }}
          >
            {filterData.map((data, index) => (
              <div key={`filter-${index}`} className="mb-6 last:mb-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(data.filterType)}
                >
                  <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase dark:text-gray-200">
                    {data.filterType}
                  </h2>
                  <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                    {expanded[data.filterType] ? (
                      <span className="text-sm">−</span>
                    ) : (
                      <span className="text-sm">+</span>
                    )}
                  </Button>
                </div>

                {expanded[data.filterType] && (
                  <RadioGroup
                    value={
                      data.filterType === "Location"
                        ? selectedLocation
                        : selectedIndustry
                    }
                    onValueChange={(value) =>
                      handleFilterChange(value, data.filterType)
                    }
                    className="mt-1 ml-1 space-y-1"
                  >
                    {/* "All" Option */}
                    <div className="flex items-center py-1.5 pl-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <RadioGroupItem
                        value="All"
                        id={`${data.filterType}-all`}
                        className="mr-2 text-blue-600 dark:text-blue-400"
                      />
                      <Label
                        htmlFor={`${data.filterType}-all`}
                        className="text-sm text-gray-700 cursor-pointer dark:text-gray-300"
                      >
                        All
                      </Label>
                    </div>

                    {data.array.map((item, idx) => {
                      const itemId = `id${index}-${idx}`;

                      return (
                        <div
                          key={itemId}
                          className="flex items-center py-1.5 pl-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <RadioGroupItem
                            value={item}
                            id={itemId}
                            className="mr-2 text-blue-600 dark:text-blue-400"
                          />
                          <Label
                            htmlFor={itemId}
                            className="text-sm text-gray-700 cursor-pointer dark:text-gray-300"
                          >
                            {item}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>
            ))}
          </ScrollArea>

          {/* Mobile Apply Button */}
          <div className="mt-4 md:hidden">
            <Button
              className="w-full"
              onClick={() => setIsMobileExpanded(false)}
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FilterCard;
