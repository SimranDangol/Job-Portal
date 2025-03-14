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
        
          dispatch(setCompanies(res.data.data)); 
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [dispatch]); 
};

export default useGetAllCompanies;