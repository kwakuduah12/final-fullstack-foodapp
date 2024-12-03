import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './userContext'; 

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const { userInfo } = useAuth();
  

    console.log("userInfo", userInfo);
    console.log("allowedRoles", allowedRoles);
   
    if (!userInfo) {
        return <Navigate to="/" />; 
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        console.log("Not Authorized");
        return <Navigate to="/not-authorized" />; 
    }
    console.log("Authorized");

    return children;
};

export default ProtectedRoutes;