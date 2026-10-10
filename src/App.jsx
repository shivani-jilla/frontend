import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public & Student Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import CourseLearning from './pages/CourseLearning';
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './pages/MyCourses';
import MyGrades from './pages/MyGrades';
import AssignmentList from './pages/AssignmentList';
import SubmitAssignment from './pages/SubmitAssignment';

// Instructor & Admin Pages
import InstructorDashboard from './pages/InstructorDashboard';
import ManageCourses from './pages/ManageCourses';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import ManageLessons from './pages/ManageLessons';
import ManageAssignments from './pages/ManageAssignments';
import ViewSubmissions from './pages/ViewSubmissions';

// Admin Only Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';

// 404
import NotFound from './pages/NotFound';

// Helper layout component to conditionally render Footer
const AppLayout = () => {
  const location = useLocation();
  const isLearningRoom = location.pathname.includes('/learn');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Immersive Classroom Learning */}
          <Route
            path="/courses/:id/learn"
            element={
              <RoleBasedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                <CourseLearning />
              </RoleBasedRoute>
            }
          />

          {/* Course Assignments List */}
          <Route
            path="/courses/:id/assignments"
            element={
              <ProtectedRoute>
                <AssignmentList />
              </ProtectedRoute>
            }
          />

          {/* Student Assignment Submission Form */}
          <Route
            path="/assignments/:id/submit"
            element={
              <RoleBasedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <SubmitAssignment />
              </RoleBasedRoute>
            }
          />

          {/* Portal / Dashboard Routes with Side Navigation */}
          <Route element={<DashboardLayout />}>
            {/* Student Portal */}
            <Route
              path="/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <RoleBasedRoute allowedRoles={['STUDENT']}>
                  <MyCourses />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/my-grades"
              element={
                <RoleBasedRoute allowedRoles={['STUDENT']}>
                  <MyGrades />
                </RoleBasedRoute>
              }
            />

            {/* Instructor Portal */}
            <Route
              path="/instructor"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <InstructorDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/manage-courses"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <ManageCourses />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/create-course"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <CreateCourse />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/courses/:id/edit"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <EditCourse />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/courses/:id/manage-lessons"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <ManageLessons />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/courses/:id/manage-assignments"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <ManageAssignments />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/assignments/:id/submissions"
              element={
                <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <ViewSubmissions />
                </RoleBasedRoute>
              }
            />

            {/* Administrator Console */}
            <Route
              path="/admin"
              element={
                <RoleBasedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <RoleBasedRoute allowedRoles={['ADMIN']}>
                  <ManageUsers />
                </RoleBasedRoute>
              }
            />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isLearningRoom && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
