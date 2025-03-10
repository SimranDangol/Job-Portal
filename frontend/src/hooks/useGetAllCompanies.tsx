import { setCompanies } from "@/redux/companySlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`/api/v1/company/get`, { withCredentials: true });
        console.log("API Response:", res.data);
        if (res.data.success) {
          // Fix: Access the correct property where companies are stored
          dispatch(setCompanies(res.data.data)); // Changed from res.data.companies to res.data.data
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [dispatch]); // Re-fetch only if dispatch changes
};

export default useGetAllCompanies;