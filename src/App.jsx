// ./src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import AdminLayout from "./components/layouts/AdminLayout";
import AddVendorForm from "./components/AddVendorForm";
import Settings from "./pages/Settings";
import Vendors from "./pages/Vendors";
import Transactions from "./pages/Transactions";

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
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/transactions" element={<Transactions />} />
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444',
                color: '#fff',
              },
            },
          }}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;