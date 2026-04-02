import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // We check if a token already exists in the browser's memory
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    // This "Effect" runs when the app starts
    useEffect(() => {
        if (token) {
            // If we have a token, we save it for the whole app to use
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};