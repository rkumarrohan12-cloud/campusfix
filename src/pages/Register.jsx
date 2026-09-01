import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="text-5xl mb-3">
            🚨
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join CampusFix
          </p>

        </div>


        {/* Registration Form */}
        <form className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>


          {/* College Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Email
            </label>

            <input
              type="email"
              placeholder="example@college.edu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>


          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID
            </label>

            <input
              type="text"
              placeholder="Enter your student ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>


          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>


          {/* Create Account */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                       font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>

        </form>


        {/* Login Link */}
        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;