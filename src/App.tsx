import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth1/auth-page";
import AdminDashboard from "./components/Admin/AdminDashboard";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
