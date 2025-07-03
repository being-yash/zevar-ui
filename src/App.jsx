// ./src/App.js
import React from "react";
import { useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="mb-4">Email: {user.email}</p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={logout}
      >
        Logout
      </button>
      {/* Dummy data table or content can go here */}
    </div>
  );
}

function App() {
  const { user } = useAuth();
  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      {user ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

export default App;