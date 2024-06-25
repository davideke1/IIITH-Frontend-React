import React from "react";
import { Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
// import Layout from "./components/users/Layout";
import Dashboard from "./pages/users/Dashboard";
import Notification from "./pages/users/Notifications";
import Profile from "./pages/users/ProfilePage";
import PasswordChange from "./pages/users/PasswordChange";
import FeedbackForm from "./pages/users/Feedback";
import Login from "./pages/users/Login";
// import Registration from "./pages/users/Register";
import RequestPasswordResetEmail from "./pages/users/RequestPasswordResetEmail";
import PasswordTokenCheck from "./pages/users/PasswordTokenCheck";
import SetNewPassword from "./pages/users/SetNewPassword";

import RegistrationForm from "./pages/users/Register";
import CheckEmail from "./pages/users/CheckEmail";
import VerifyEmail from "./pages/users/VerifyEmail";
// import CustomPage from "./pages/users/CustomPage";
import { ProtectedRoute, AdminProtectedRoute, UserProtectedRoute } from "./routes/ProtectedRoute";
// import AdminPage from "./pages/admin/AdminDashboard";

import DataExport from "./views/DataExport";
import UserList from "./views/UserLists";
import UserManagement from "./views/UsersManagement";
import AdminDashboard from "./views/AdminDashBoard";
import AdminLogin from "./views/AdminLogin";
import UserHistoryData from "./views/UserHistoryData";
import LargerLeafletMap from "./views/LargerMap";
import AdminNotification from "./views/SendNotifications";
// import Nav from "./components/admin/Nav";
// import LayoutAdmin from "./components/admin/layout copy";
// import TestDashboard from "./pages/admin/Dashboard";
// import HistoricalDataPage from "./pages/admin/UserProfile";
// import MainComponent from "./pages/admin/Testing";
import WQITable from "./views/UserWQIStatus";
import HistoryData from "./pages/users/HistoryData";
import Home from "./pages/Homepage/Homepage";
import NotFound from "./pages/Homepage/NotFound";
import AdminProfile from "./views/AdminProfile";
import AdminPasswordChange from "./views/AdminPasswordchange";
import UserFeedback from "./views/UserFeedbacks";
import Flow from "./pages/users/Flow";


function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound/>} />
          {/* <Route path="/layout" element={<Layout />} /> */}
          <Route
            path="/dashboard"
            element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <UserProtectedRoute>
                <Notification />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/password-change"
            element={
              <UserProtectedRoute>
                <PasswordChange />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserProtectedRoute>
                <Profile />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/complains"
            element={
              <UserProtectedRoute>
                <FeedbackForm />
              </UserProtectedRoute>
            }
          />
           <Route path="/historydata" element={<HistoryData />} />
           <Route path="/flow" element={<Flow />} />


          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/email-verify/:token" element={<VerifyEmail />} />
          
          <Route
            path="/request-password-reset-email"
            element={<RequestPasswordResetEmail />}
          />
          <Route path="/password-reset/password-token-check/:uidb64/:token" element={<PasswordTokenCheck />} />
        <Route path="/set-new-password/:uidb64/:token" element={<SetNewPassword />} />
          {/* <Route path="/custompage" element={<CustomPage />} /> */}

          {/* Admin */}
          {/* <Route path="/adminlogin" element={<AdminLogin />} /> */}
          <Route path="/loginadmin" element={<AdminLogin />} />
          {/* <Route path="/admin" element={<AdminPage />} /> */}
          <Route path="/admindashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/export" element={
        <AdminProtectedRoute>
          <DataExport />
        </AdminProtectedRoute>
      } />
      <Route path="/user-management" element={
        <AdminProtectedRoute>
          <UserManagement />
        </AdminProtectedRoute>
      } />
      <Route path="/user-list" element={
        <AdminProtectedRoute>
          <UserList />
        </AdminProtectedRoute>
      } />
      <Route path="/adminnotification" element={
        <AdminProtectedRoute>
          <AdminNotification />
        </AdminProtectedRoute>
      } />
      <Route path="/adminprofile" element={
        <AdminProtectedRoute>
          <AdminProfile />
        </AdminProtectedRoute>
      } />
      <Route path="/adminpasswordchange" element={
        <AdminProtectedRoute>
          <AdminPasswordChange />
        </AdminProtectedRoute>
      } />
      <Route path="/userhistorydata" element={
        <AdminProtectedRoute>
          <UserHistoryData />
        </AdminProtectedRoute>
      } />
      <Route path="/mainmap" element={
        <AdminProtectedRoute>
          <LargerLeafletMap />
        </AdminProtectedRoute>
      } />
      <Route path="/userfeedback" element={
        <AdminProtectedRoute>
          <UserFeedback />
        </AdminProtectedRoute>
      } />
      <Route path="/wqistatus" element={
        <AdminProtectedRoute>
          <WQITable />
        </AdminProtectedRoute>
      } />
        </Routes>
        
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
