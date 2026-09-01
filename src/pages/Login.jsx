import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚨</div>

          <h1 className="text-3xl font-bold text-gray-800">
            CampusFix
          </h1>

          <p className="text-gray-500 mt-2">
            College Complaint & Maintenance System
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5">

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                       font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
  to="/register"
  className="text-blue-600 font-semibold hover:underline"
>
  Register
</Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;