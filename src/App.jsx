import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";


const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) {
    
    return <Navigate to="/SignIn" />;
  }

  if (role && userRole !== role) {
    
    return <Navigate to="/SignIn" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Navigate to="/SignIn" />} />

        
        <Route path="/SignIn" element={<SignInPage />} />

        
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

       
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route path="*" element={<Navigate to="/SignIn" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;