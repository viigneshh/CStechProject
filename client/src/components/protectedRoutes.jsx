import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // null = checking, true = authenticated, false = not authenticated

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsValid(false);
      return;
    }

    axios
      .get("http://localhost:5000/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false));
  }, []);

  // While checking token, don't render children (prevents dashboard flash)
  if (isValid === null) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Checking authentication...</div>;
  }

  // If not valid, redirect to login
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // If valid, render protected content
  return children;
};

export default ProtectedRoute;
