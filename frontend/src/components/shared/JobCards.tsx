import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

interface Company {
  name: string;
  logo?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  position: string;
  jobType: string;
  company: Company;
  location?: string;
}

interface JobCardsProps {
  job: Job;
}

const JobCards = ({ job }: JobCardsProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 bg-white border rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#6A38C2] hover:bg-gray-50 hover:scale-105"
    >
      {/* Company Logo & Name */}
      <div className="flex items-center gap-4">
        {job?.company?.logo ? (
          <img
            src={job.company.logo}
            alt={job.company.name}
            className="object-cover rounded-full w-14 h-14"
          />
        ) : (
          <div className="flex items-center justify-center text-lg font-semibold bg-gray-200 rounded-full w-14 h-14">
            {job?.company?.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{job?.company?.name}</h2>
          <p className="text-sm text-gray-500">{job?.location || "Location not specified"}</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* Job Badges (Position & Type) */}
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">Vacancy:</span>
          <Badge className="px-4 py-1 border-2 border-[#6A38C2] text-[#6A38C2]" variant="outline">
            {job?.position}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge className="px-4 py-1 text-green-700 bg-green-100" variant="outline">
            {job?.jobType}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default JobCards;
