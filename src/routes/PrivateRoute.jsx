import React from "react";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <progress className="progress w-56"></progress>;
  }

  if (!user) {
    return <Navigate to="/login"></Navigate>;
  }
  return <div>{children} </div>;
};

export default PrivateRoute;
