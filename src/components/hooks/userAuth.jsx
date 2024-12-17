import React, { createContext, useContext, useState, useEffect } from 'react';
import {API_ENDPOINT} from "@/api/auth.ts"

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ accessToken: localStorage.getItem('accessToken') || null, user: null });

    useEffect(() => {
        if (auth.accessToken) {
            const getUserDetails = async () => {
                const response = await fetch(`${API_ENDPOINT}/api/v1/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
                const res = await response.json();
                if (res.status=='success') {
                    setAuth(prev => ({ ...prev, user: res.user }));
                } else {
                    logout();  // Auto logout if token is invalid
                }
            };
            getUserDetails();
        }
    }, [auth.accessToken]);

    const loginAuthUser = (accessToken, user) => {
        localStorage.setItem('accessToken', accessToken);
        setAuth({ accessToken, user});
    };

    const logoutAuthUser = () => {
        localStorage.removeItem('accessToken');
        setAuth({ accessToken: null, user: null, cart:null,paymentType:null});
    };

    
    return (
        <AuthContext.Provider value={{ auth, loginAuthUser, logoutAuthUser}}>
            {children}
        </AuthContext.Provider>
    );
};
 const useAuth = () => useContext(AuthContext);

export {useAuth,AuthProvider}
