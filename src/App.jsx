// ./src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import AdminLayout from "./components/layouts/AdminLayout";
import AddVendorForm from "./components/AddVendorForm";
import Settings from "./pages/Settings";

function App() {
  const { user } = useAuth();
  return (
    <ThemeProvider>
      <Router>
        {user ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route
              path="/vendors/add"
              element={
                <AdminLayout>
                  <AddVendorForm />
                </AdminLayout>
              }
            />
            <Route path="/settings" element={ <Settings /> } />
            {/* Add more routes as needed */}
          </Routes>
        ) : (
          <div className="flex justify-center items-center h-screen bg-blue-500">
            <LoginForm />
          </div>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;