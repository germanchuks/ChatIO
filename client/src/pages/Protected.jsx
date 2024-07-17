import React from 'react'
import { Navigate } from 'react-router-dom'

const Protected = ({ isAuthenticated, children }) => {
    return (
        isAuthenticated ? children : <Navigate to="/" replace />
    );
}

export default Protected;