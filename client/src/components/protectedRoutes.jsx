import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsValid(false);
      return;
    }

    axios.get("http://localhost:5000/auth/verify", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setIsValid(true))
    .catch(() => setIsValid(false));
  }, []);

  if (isValid === null) return <p>Loading...</p>;
  if (!isValid) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
