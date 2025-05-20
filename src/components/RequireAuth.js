import React from 'react';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  let token = localStorage.getItem('token');
  if (!token) {
    // Forza login automatico in sviluppo
    localStorage.setItem('token', 'accesso-diretto');
    token = 'accesso-diretto';
  }
  return children;
}

export default RequireAuth; 