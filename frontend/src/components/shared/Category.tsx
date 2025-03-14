import { useDispatch } from "react-redux";
import { setSelectedCategory } from "@/redux/jobSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";


const categories = [
  "Information Technology",
  "Business & Finance",
  "Digital Marketing",
  "Education & Teaching",
  "Accounting",
  "Graphic Designer",
  "Sales",
];

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    dispatch(setSelectedCategory(category));
    console.log("Selected category:", category);
    navigate("/browse");
  };

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Browse by Category
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Explore jobs across various industries.
          </p>
        </div>
        <Button
          variant="outline"
          className="hidden gap-2 text-gray-700 border-gray-200 rounded-lg sm:flex hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 md:ml-4"
          onClick={() => {
            dispatch(setSelectedCategory("All"));
            navigate("/browse");
          }}
        >
          <Search className="w-4 h-4" /> View All Categories
        </Button>
      </div>
      {/* Category Browse Section */}
      <div className="mt-10 space-y-8">
        {/* Mobile Categories */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {categories.slice(0, 6).map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full py-4 text-sm transition-all duration-300 border-gray-200 rounded-xl dark:border-gray-700 hover:shadow-md dark:hover:bg-gray-800"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
          <Button
            className="w-full col-span-2 py-4 text-sm text-blue-600 border border-blue-100 bg-blue-50 rounded-xl hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900"
            onClick={() => {
              dispatch(setSelectedCategory("All"));
              navigate("/browse");
            }}
          >
            View All Categories
          </Button>
        </div>
        {/* Desktop Carousel */}
        <div className="relative hidden md:block">
          <Carousel className="w-full">
            <CarouselContent>
              {categories.map((category, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div
                    className="flex items-center justify-center p-6 transition-all bg-white border border-gray-100 shadow-lg cursor-pointer h-36 rounded-2xl hover:shadow-xl dark:bg-gray-800 dark:border-gray-700"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <span className="text-lg font-semibold text-center text-gray-800 dark:text-white">
                      {category}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <CarouselPrevious className="w-12 h-12 text-gray-600 transition-all duration-300 bg-white rounded-full shadow-lg pointer-events-auto hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" />
              <CarouselNext className="w-12 h-12 text-gray-600 transition-all duration-300 bg-white rounded-full shadow-lg pointer-events-auto hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Category;