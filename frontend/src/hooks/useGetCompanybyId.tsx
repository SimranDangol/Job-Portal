import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Type the companyId parameter as string
const useGetCompanyById = (companyId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!companyId) {
      console.error("Company ID is required");
      return;
    }

    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`api/v1/company/get/${companyId}`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          // Fix for mismatched API response structure
          const companyData = res.data.message || res.data.company || res.data.data;
          if (companyData && typeof companyData === 'object') {
            dispatch(setSingleCompany(companyData));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleCompany();
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
