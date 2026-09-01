import { Link } from "react-router-dom";
import { useState } from "react";

function CreateComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    block: "",
    floor: "",
    room: "",
    description: "",
    photo: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handles text and select changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handles photo upload
  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a problem title.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.block) {
      setError("Please select a block.");
      return;
    }

    if (!formData.floor) {
      setError("Please select a floor.");
      return;
    }

    if (!formData.room.trim()) {
      setError("Please enter a room or lab number.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe the problem.");
      return;
    }

    // Temporary success message
    setSuccess("Complaint submitted successfully!");

    // Show data in browser console
    console.log("Complaint Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">

        <Link to="/dashboard" className="flex items-center gap-3">

          <span className="text-3xl">
            🚨
          </span>

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


      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">

          <Link
            to="/complaints"
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back to Complaints
          </Link>

          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Report a Problem
          </h2>

          <p className="text-gray-500 mt-1">
            Tell us about the issue and we'll make sure it gets resolved.
          </p>

        </div>


        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600
                              px-4 py-3 rounded-lg">
                {error}
              </div>
            )}


            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600
                              px-4 py-3 rounded-lg">
                {success}
              </div>
            )}


            {/* Title */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Projector not working"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Category */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           bg-white focus:outline-none focus:ring-2
                           focus:ring-blue-500"
              >

                <option value="">
                  Select a category
                </option>

                <option value="electrical">
                  ⚡ Electrical
                </option>

                <option value="it">
                  💻 IT / WiFi
                </option>

                <option value="equipment">
                  🖥️ Equipment
                </option>

                <option value="furniture">
                  🪑 Furniture
                </option>

                <option value="cleanliness">
                  🧹 Cleanliness
                </option>

                <option value="other">
                  📌 Other
                </option>

              </select>

            </div>


            {/* Location */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Block */}
                <select
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg
                             bg-white focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                >

                  <option value="">
                    Select Block
                  </option>

                  <option value="Block A">
                    Block A
                  </option>

                  <option value="Block B">
                    Block B
                  </option>

                  <option value="Block C">
                    Block C
                  </option>

                </select>


                {/* Floor */}
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg
                             bg-white focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                >

                  <option value="">
                    Select Floor
                  </option>

                  <option value="Ground Floor">
                    Ground Floor
                  </option>

                  <option value="1st Floor">
                    1st Floor
                  </option>

                  <option value="2nd Floor">
                    2nd Floor
                  </option>

                  <option value="3rd Floor">
                    3rd Floor
                  </option>

                </select>


                {/* Room */}
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="Room / Lab No."
                  className="px-4 py-3 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                />

              </div>

            </div>


            {/* Description */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the problem in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           resize-none"
              />

            </div>


            {/* Photo */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Photo
                <span className="text-gray-400 font-normal">
                  {" "}(Optional)
                </span>
              </label>

              <div className="border-2 border-dashed border-gray-300
                              rounded-lg p-8 text-center
                              hover:border-blue-400 transition">

                <div className="text-4xl mb-3">
                  📷
                </div>

                <p className="text-sm text-gray-600">
                  Upload a photo of the problem
                </p>

                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-4 block mx-auto text-sm"
                />

              </div>

            </div>


            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">

              <Link
                to="/complaints"
                className="px-6 py-3 border border-gray-300
                           rounded-lg text-gray-600
                           hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white
                           rounded-lg font-semibold
                           hover:bg-blue-700 transition"
              >
                Submit Complaint
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default CreateComplaint;