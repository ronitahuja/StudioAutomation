import React from 'react';
import PropTypes from "prop-types";
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({children}) => {
    const token = Cookies.get('token');

    const isAuthenticated = (()=>{
        if(!token) return false;
        try{
            const decodedToken = jwtDecode(token);

            // Check if the token is expired
            const currentTime = Math.floor(Date.now() / 1000);

            if(decodedToken.exp < currentTime) return false; 
            return true;
        }
        catch(err){
            console.lof(err);
            return false;
        }
    })()
    return isAuthenticated ? children : <Navigate to="/login" />;
}
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, 
};
export default ProtectedRoute;