// ./src/App.js
import React from "react";
import { useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

function App() {
  const { user } = useAuth();
  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      {user ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

export default App;