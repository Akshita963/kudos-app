// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from './api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // only try if we have an access token
    if (!localStorage.getItem('access_token')) return;
    api.get('users/')
      .then(res => {
        // your endpoint returns the list of same‑org users;
        // you might instead have an endpoint /users/me/
        // adjust accordingly:
        setUser(res.data.find(u => u.username)); 
      })
      .catch(err => {
        console.error("Failed to load user profile:", err);
        // optionally clear tokens and force logout:
        // localStorage.clear();
        // window.location.href = '/login';
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
