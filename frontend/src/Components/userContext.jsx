import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return { id: decoded.id, role: decoded.role }; 
            } catch (error) {
                console.error("Failed to decode token:", error);
                return null;
            }
        }
        return null;
    });

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); 
                const endpoint = decoded.role === 'Merchant' ? 'merchant/profile' : 'user/profile'; 
                
                const response = await fetch(`http://localhost:4000/${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched User Profile:", data.data);

                    setUserInfo({
                        ...data.data,
                        role: decoded.role
                    });
                } else {
                    console.error("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !userInfo?.name) {  
            fetchUserProfile();
        }
    }, [userInfo?.name]); 

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUserInfo({ id: decoded.id, role: decoded.role });
        fetchUserProfile(); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);