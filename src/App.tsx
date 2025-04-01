import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth1/auth-page";
import AdminDashboard from "./components/Admin/AdminDashboard";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
import { useState } from "react"
import ClientHome from "./pages/client/ClientHome"
import LawyerHome from "./pages/lawyer/LawyerHome"
import ProfilePage from "./pages/common/ProfilePage"
import PostCase from "./pages/client/PostCase"
import AvailableCases from "./pages/lawyer/AvailableCases"
import CaseDetail from "./pages/lawyer/CaseDetail"
import NotificationsPage from "./pages/common/NotificationsPage"
import AppointmentsPage from "./pages/appointments/AppointmentsPage"
import FindLawyers from "./components/Client/FindLawyers";
import MyCases from "./pages/client/MyCases";
import MyBids from "./pages/lawyer/MyBids";
import MessagesPage from "./pages/common/MessagesPage";

const App = () => {
  const [user] = useState({
    id: 1,
    name: "John Smith",
    role: "client", // 'client', 'lawyer', or 'admin'
  })
  return (
    <Routes>
<Route
  path="/client/home"
  element={user.role === "client" ? <ClientHome userName={user.name} /> : <Navigate to="/" replace />}
/>
<Route
  path="/client/profile"
  element={
    user.role === "client" ? (
      <ProfilePage userName={user.name} userRole="client" />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
<Route
  path="/client/cases/post"
  element={user.role === "client" ? <PostCase userName={user.name} /> : <Navigate to="/" replace />}
/>
<Route
  path="/client/notifications"
  element={
    user.role === "client" ? (
      <NotificationsPage userName={user.name} userRole="client" />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
<Route
  path="/client/appointments"
  element={
    user.role === "client" ? (
      <AppointmentsPage userName={user.name} userRole="client" />
    ) : (
      <Navigate to="/" replace />
    )
  }
/> 

<Route
          path="/client/lawyers"
          element={user.role === "client" ? <FindLawyers userName={user.name} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/client/cases"
          element={user.role === "client" ? <MyCases userName={user.name} /> : <Navigate to="/" replace />}
        />

<Route
  path="/lawyer/home"
  element={user.role === "lawyer" ? <LawyerHome userName={user.name} /> : <Navigate to="/" replace />}
/>
<Route
  path="/lawyer/profile"
  element={
    user.role === "lawyer" ? (
      <ProfilePage userName={user.name} userRole="lawyer" />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
<Route
  path="/lawyer/cases/available"
  element={user.role === "lawyer" ? <AvailableCases userName={user.name} /> : <Navigate to="/" replace />}
/>
<Route
  path="/lawyer/cases/available/:id"
  element={user.role === "lawyer" ? <CaseDetail userName={user.name} /> : <Navigate to="/" replace />}
/>
<Route
  path="/lawyer/notifications"
  element={
    user.role === "lawyer" ? (
      <NotificationsPage userName={user.name} userRole="lawyer" />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
<Route
  path="/lawyer/appointments"
  element={
    user.role === "lawyer" ? (
      <AppointmentsPage userName={user.name} userRole="lawyer" />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>

<Route
          path="/lawyer/bids"
          element={user.role === "lawyer" ? <MyBids userName={user.name} /> : <Navigate to="/" replace />}
        />

<Route
          path="/common/messages/:conversationId"
          element={
            user.role === "lawyer" ? (
              <MessagesPage userName={user.name} userRole="lawyer" />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

{/* Fallback route */}
<Route path="*" element={<Navigate to="/" replace />} />


      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
