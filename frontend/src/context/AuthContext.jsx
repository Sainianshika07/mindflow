import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("mindflow_token");
      const storedUser = localStorage.getItem("mindflow_user");
      
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.data && res.data.success) {
            setUser(res.data.data);
            localStorage.setItem("mindflow_user", JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error("Backend auth failed, using stored local session:", err.message);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem("mindflow_token");
          }
        }
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      if (res.data && res.data.success) {
        const { token, user: loggedUser } = res.data;
        localStorage.setItem("mindflow_token", token);
        localStorage.setItem("mindflow_user", JSON.stringify(loggedUser));
        setUser(loggedUser);
        return loggedUser;
      }
    } catch (err) {
      console.warn("Backend login failed, attempting standalone mock login:", err.message);
      if (!err.response) {
        const mockUser = {
          id: "1",
          email,
          name: email.split("@")[0],
          avatar: null,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("mindflow_token", "mock_token_demo");
        localStorage.setItem("mindflow_user", JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      }
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await authAPI.register(name, email, password);
      if (res.data && res.data.success) {
        const { token, user: loggedUser } = res.data;
        localStorage.setItem("mindflow_token", token);
        localStorage.setItem("mindflow_user", JSON.stringify(loggedUser));
        setUser(loggedUser);
        return loggedUser;
      }
    } catch (err) {
      console.warn("Backend signup failed, attempting standalone mock signup:", err.message);
      if (!err.response) {
        const mockUser = {
          id: Date.now().toString(),
          email,
          name,
          avatar: null,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("mindflow_token", "mock_token_demo");
        localStorage.setItem("mindflow_user", JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mindflow_token");
    localStorage.removeItem("mindflow_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
