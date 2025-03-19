import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth1/auth-page";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ResetPassword from "./pages/auth1/ResetPassword";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;