import { BrowserRouter, Routes, Route } from "react-router-dom";
import Complaints from "./pages/Complaints";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateComplaint from "./pages/CreateComplaint";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/complaints/new"
  element={<CreateComplaint />}
/>
        <Route path="/complaints" element={<Complaints />} />

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;