import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("AuthContext: Loading user from localStorage:", parsedUser);
        console.log("AuthContext: User role from localStorage:", parsedUser.role);
        console.log("AuthContext: Is admin check from localStorage:", parsedUser.role?.toLowerCase() === "admin");
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    console.log("AuthContext: Login called with user data:", userData);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    console.log(
      "AuthContext: User state updated, isAdmin:",
      userData.role?.toLowerCase() === "admin"
    );
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role?.toLowerCase() === "admin";
  
  // Debug logging
  useEffect(() => {
    console.log("AuthContext: State changed - user:", user, "isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin);
  }, [user, isAuthenticated, isAdmin]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
