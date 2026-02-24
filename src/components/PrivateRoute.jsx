import {Navigate} from "react-router-dom";

const PrivateRoute = ({children}) => {
    // Check if authentication token exists in browser's localStorage
    const token = localStorage.getItem("token");
    
    // If no token found, redirect to home page (login)
    if (!token) return <Navigate to="/auth/login" />;
    
    // Token exists, render the protected content
    return children;
};

export default PrivateRoute;