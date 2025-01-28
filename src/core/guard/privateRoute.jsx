import { AuthService } from "../../services/auth/authService.js";
import { Navigate } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};
export default PrivateRoute;
