import { Link } from "react-router-dom";
import { useState } from "react";

const complaints = [
  {
    id: "1024",
    title: "Projector not working",
    category: "Equipment",
    location: "Lab 3",
    status: "In Progress",
    priority: "High",
    date: "2 days ago",
  },
  {
    id: "1021",
    title: "WiFi not working",
    category: "IT / WiFi",
    location: "Block B",
    status: "Pending",
    priority: "Medium",
    date: "3 days ago",
  },
  {
    id: "1018",
    title: "Fan not working",
    category: "Electrical",
    location: "Room 204",
    status: "Resolved",
    priority: "Low",
    date: "1 week ago",
  },
  {
    id: "1015",
    title: "Broken chair",
    category: "Furniture",
    location: "Room 105",
    status: "Resolved",
    priority: "Low",
    date: "2 weeks ago",
  },
];

function Complaints() {
    const [filter, setFilter] = useState("All");
    const filteredComplaints =
  filter === "All"
    ? complaints
    : complaints.filter(
        (complaint) => complaint.status === filter
      );
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">

        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="text-3xl">🚨</span>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              CampusFix
            </h1>

            <p className="text-xs text-gray-500">
              College Maintenance System
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Rohan Kumar
          </span>

          <div className="w-9 h-9 bg-blue-600 text-white rounded-full
                          flex items-center justify-center font-semibold">
            R
          </div>
        </div>

      </nav>


      {/* Main */}
      <main className="max-w-6xl mx-auto p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              My Complaints
            </h2>

            <p className="text-gray-500 mt-1">
              Track and manage your reported issues.
            </p>
          </div>

          <Link
            to="/complaints/new"
            className="bg-blue-600 text-white px-5 py-3
                       rounded-lg font-semibold hover:bg-blue-700
                       transition"
          >
            + New Complaint
          </Link>

        </div>


        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

          <div className="flex flex-wrap gap-2">

            <div className="flex flex-wrap gap-2">

  <button
    onClick={() => setFilter("All")}
    className={`px-4 py-2 rounded-lg ${
      filter === "All"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    All
  </button>


  <button
    onClick={() => setFilter("Pending")}
    className={`px-4 py-2 rounded-lg ${
      filter === "Pending"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    Pending
  </button>


  <button
    onClick={() => setFilter("In Progress")}
    className={`px-4 py-2 rounded-lg ${
      filter === "In Progress"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    In Progress
  </button>


  <button
    onClick={() => setFilter("Resolved")}
    className={`px-4 py-2 rounded-lg ${
      filter === "Resolved"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    Resolved
  </button>

</div>

          </div>

        </div>


        {/* Complaint List */}
        <div className="space-y-4">

          {filteredComplaints.map((complaint) => (

            <div
              key={complaint.id}
              className="bg-white rounded-xl shadow-sm p-6
                         hover:shadow-md transition"
            >

              <div className="flex justify-between items-start">

                {/* Left */}
                <div>

                  <div className="flex items-center gap-3">

                    <span className="text-sm font-semibold text-gray-400">
                      #{complaint.id}
                    </span>

                    <h3 className="text-lg font-semibold text-gray-800">
                      {complaint.title}
                    </h3>

                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">

                    <span>
                      🔧 {complaint.category}
                    </span>

                    <span>
                      📍 {complaint.location}
                    </span>

                    <span>
                      🕒 {complaint.date}
                    </span>

                  </div>

                </div>


                {/* Right */}
                <div className="flex items-center gap-4">

                  <div className="text-right">

                    <p className="text-xs text-gray-400">
                      Priority
                    </p>

                    <p className="font-semibold text-gray-700">
                      {complaint.priority}
                    </p>

                  </div>

                  <span className="px-3 py-1 rounded-full text-sm
                                   bg-blue-50 text-blue-600">
                    {complaint.status}
                  </span>

                  <Link
                    to={`/complaints/${complaint.id}`}
                    className="text-blue-600 font-semibold text-sm
                               hover:underline"
                  >
                    View →
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Complaints;