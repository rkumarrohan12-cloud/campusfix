import { Link } from "react-router-dom";

const complaints = [
  {
    id: "1024",
    title: "Projector not working",
    category: "Equipment",
    location: "Lab 3",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "1021",
    title: "WiFi not working",
    category: "IT / WiFi",
    location: "Block B",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "1018",
    title: "Fan not working",
    category: "Electrical",
    location: "Room 204",
    status: "Resolved",
    priority: "Low",
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <span className="text-3xl">🚨</span>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              CampusFix
            </h1>

            <p className="text-xs text-gray-500">
              College Maintenance System
            </p>
          </div>
        </div>

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


      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-73px)]
                         border-r p-5">

          <div className="space-y-2">

            <Link
              to="/dashboard"
              className="block px-4 py-3 rounded-lg bg-blue-50
                         text-blue-600 font-semibold"
            >
              📊 Dashboard
            </Link>

            <Link
              to="/complaints"
              className="block px-4 py-3 rounded-lg
                         text-gray-600 hover:bg-gray-100"
            >
              📋 My Complaints
            </Link>

            <Link
              to="/complaints/new"
              className="block px-4 py-3 rounded-lg
                         text-gray-600 hover:bg-gray-100"
            >
              ➕ New Complaint
            </Link>

          </div>

        </aside>


        {/* Main Content */}
        <main className="flex-1 p-8">

          {/* Welcome */}
          <div className="flex justify-between items-center mb-8">

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome back, Rohan 👋
              </h2>

              <p className="text-gray-500 mt-1">
                Here's what's happening with your complaints.
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


          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Total Complaints
              </p>

              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                12
              </h3>
            </div>


            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Pending
              </p>

              <h3 className="text-3xl font-bold text-yellow-500 mt-2">
                3
              </h3>
            </div>


            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Resolved
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                7
              </h3>
            </div>

          </div>


          {/* Recent Complaints */}
          <div className="bg-white rounded-xl shadow-sm">

            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                Recent Complaints
              </h3>
            </div>


            <div className="divide-y">

              {complaints.map((complaint) => (

                <div
                  key={complaint.id}
                  className="p-6 flex justify-between items-center
                             hover:bg-gray-50 transition"
                >

                  <div>

                    <div className="flex items-center gap-3">

                      <span className="text-sm font-semibold text-gray-400">
                        #{complaint.id}
                      </span>

                      <h4 className="font-semibold text-gray-800">
                        {complaint.title}
                      </h4>

                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      {complaint.category} • {complaint.location}
                    </p>

                  </div>


                  <div className="flex items-center gap-4">

                    <span className="text-sm text-gray-500">
                      {complaint.priority}
                    </span>

                    <span className="px-3 py-1 rounded-full text-sm
                                     bg-blue-50 text-blue-600">
                      {complaint.status}
                    </span>

                    <Link
                      to={`/complaints/${complaint.id}`}
                      className="text-blue-600 text-sm font-semibold
                                 hover:underline"
                    >
                      View →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;