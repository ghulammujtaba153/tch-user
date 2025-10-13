import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../config/url";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  userId: string;
  email?: string;
  exp?: number;
  iat?: number;
  // Add any other fields your token contains
}

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;

  isGoogleUse: boolean;
  isMicrosoftUse: boolean;
  gender: string | null,
  dateOfBirth: string | null,
  nationality: Date | null,
  idNumber: string | null;
  taxNumber: string | null;
  passportNumber: string | null;

  
  profilePicture: string | null;
  organization: any | null;
}

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  setUser: (user: any) => void;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedUser = jwtDecode<DecodedToken>(storedToken);

      const fetchedUser = async () => {
        try {
          const response = await fetch(`${BASE_URL}/auth/profile?id=${decodedUser.userId}`);
          const userData = await response.json();

          console.log("context user", userData);

          setUser({
            userId: userData.user._id,
            email: userData.user.email,
            name: userData.user.name,
            role: userData.user.role,
            phoneNumber: userData.user.phoneNumber || null,
            addressLine1: userData.user.addressLine1 || null,
            addressLine2: userData.user.addressLine2 || null,
            city: userData.user.city || null,
            state: userData.user.state || null,
            country: userData.user.country || null,
            postalCode: userData.user.postalCode || null,
            idNumber: userData.user.idNumber || null,
            taxNumber: userData.user.taxNumber || null,
            passportNumber: userData.user.passportNumber || null,
            isGoogleUse: userData.user.isGoogleUse,
            isMicrosoftUse: userData.user.isMicrosoftUse,
            gender: userData.user.gender,
            dateOfBirth: userData.user.dateOfBirth,
            nationality: userData.user.nationality,
            profilePicture: userData.user.profilePicture,
            organization: userData.user.organization,
          });

          setToken(userData.token);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchedUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user: any, token: string) => {
    setUser(user);
    console.log("context user on login", user)
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Ensure loading is set to false after login
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
