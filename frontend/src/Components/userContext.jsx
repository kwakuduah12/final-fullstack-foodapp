import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return { id: decoded.id, role: decoded.role }; // Basic info from token
            } catch (error) {
                console.error("Failed to decode token:", error);
                return null;
            }
        }
        return null;
    });

    // Fetch full user profile from the server, with endpoint based on role
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode token to get role
                const endpoint = decoded.role === 'Merchant' ? 'merchant/profile' : 'user/profile'; // Dynamic endpoint
                
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

                    // Merge profile data with role
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
        // Fetch user profile data on initial load if token is present
        const token = localStorage.getItem('token');
        if (token && !userInfo?.name) {  // Only fetch if no profile data
            fetchUserProfile();
        }
    }, []); // Run only once on mount

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUserInfo({ id: decoded.id, role: decoded.role });
        fetchUserProfile(); // Fetch full profile after login
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