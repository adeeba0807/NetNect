import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login"; // <--- Add this import!
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import EditProfile from "./pages/Editprofile";  
import Network from "./pages/Network";
import PublicProfile from "./pages/PublicProfile";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Now both pages are defined! */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/network" element={<Network />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;