import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({children}) => {
    const token = Cookies.get('token');

    const isAuthenticated = (()=>{
        if(!token) return false;
        try{
            const decodedToken = jwtDecode(token);

            // Check if the token is expired
            const currentTime = Math.floor(Date.now() / 1000);

            if(decodedToken.exp < currentTime) return false; //token expired
            return true;
        }
        catch(err){
            return false;
        }
    })()
    return isAuthenticated ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;