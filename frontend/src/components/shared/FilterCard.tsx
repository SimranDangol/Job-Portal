import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// TypeScript interfaces
interface FilterItem {
  filterType: string;
  array: string[];
  icon?: React.ReactNode;
}

// Enhanced filter data with icons
const filterData: FilterItem[] = [
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
      "Accounting",
      "Digital Marketing",
      "Education",
      "Hospitality",
      "Graphics Designer",
      "Sales & Marketing",
    ],
  },
];

const FilterCard: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Location: true,
    Industry: true,
  });
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  
  const dispatch = useDispatch();
  
  const changeHandler = (value: string): void => {
    setSelectedValue(value);
  };
  
  const clearFilter = (): void => {
    setSelectedValue("");
  };
  
  const toggleSection = (section: string): void => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);
  
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
          {selectedValue && (
            <Badge variant="secondary" className="ml-2">1</Badge>
          )}
        </Button>
      </div>
      
      {/* Filter Card - Responsive */}
      <Card className={`
        bg-white dark:bg-gray-800 shadow-md border-0
        transition-all duration-300
        md:block
        ${isMobileExpanded ? 'block' : 'hidden'}
      `}>
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Filter Jobs
            </CardTitle>
            {selectedValue && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilter} 
                className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          {selectedValue && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                {selectedValue}
                <button 
                  className="ml-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                  onClick={clearFilter}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="px-4 pb-4">
          <ScrollArea className="max-h-[calc(100vh-200px)] pr-3">
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
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
                      {expanded[data.filterType] ? 
                        <span className="text-sm">−</span> : 
                        <span className="text-sm">+</span>
                      }
                    </Button>
                  </div>
                  
                  {expanded[data.filterType] && (
                    <div className="mt-1 ml-1 space-y-1">
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
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
          
          {/* Mobile Only: Done button */}
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