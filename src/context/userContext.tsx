

import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../config/url";


export const AuthContext = createContext(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
        const decodedUser = jwtDecode(storedToken);
        const fetchedUser = async () => {
          try {
            
            const response = await fetch(`${BASE_URL}/auth/profile?id=${decodedUser?.userId}`);
            const userData = await response.json();
            
            console.log("context user",userData);
            setUser({
              userId: userData.user._id,
              email: userData.user.email,
              name: userData.user.name,
              role: userData.user.role,
              profilePicture: userData.user.profilePicture,
              organization: userData.user.organization,
            });
            setToken(userData.token);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
            
        }
        fetchedUser();
    }
  }, []);

  const login = (user, token) => {
    console.log(user)
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
