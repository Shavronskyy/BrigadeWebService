import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { API_CONFIG } from "../config/api";
import "./Login.css";

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Handle redirects when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        console.log(
          "User is authenticated and admin, redirecting to admin panel"
        );
        navigate("/admin");
      } else {
        console.log("User is authenticated but not admin, redirecting to home");
        navigate("/");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Call backend API directly
      const url = `/api/Auth/login`;
      const isEmail = formData.username.includes("@");
      const requestBody = isEmail
        ? { email: formData.username, password: formData.password }
        : { username: formData.username, password: formData.password };
      console.log("Sending request to:", url);
      console.log("Request body:", requestBody);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login
        console.log("Login successful:", data);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        setSuccess("Вхід успішний.");

        // Store user data and token using AuthContext
        if (data.accessToken) {
          // Decode JWT token to get user info
          const tokenPayload = JSON.parse(atob(data.accessToken.split(".")[1]));
          console.log("Token payload:", tokenPayload);

          // Create user object from token claims
          const userData = {
            id: 1, // We don't have an ID from the token, so use a default
            username:
              tokenPayload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ] ||
              tokenPayload.name ||
              tokenPayload.sub ||
              "Unknown",
            email: tokenPayload.email || "",
            role:
              tokenPayload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] ||
              tokenPayload.role ||
              "User",
          };

          console.log("Extracted user data:", userData);
          console.log("User role:", userData.role);
          console.log("Is admin?", userData.role.toLowerCase() === "admin");
          console.log("About to call login function with token and userData");

          login(data.accessToken, userData);

          console.log("Login function called, checking auth state...");
        }
      } else {
        let errorMessage = "Помилка входу";
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData: any = await response.json();
            errorMessage =
              errorData?.message || errorData?.error || errorMessage;
          } else {
            const text = await response.text();
            if (text) errorMessage = text;
          }
        } catch (parseErr) {
          // ignore parse errors and fall back to default message
        }

        if (
          response.status === 401 &&
          (!errorMessage || errorMessage === "Помилка входу")
        ) {
          errorMessage = "Невірний логін або пароль";
        }

        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error details:", err);
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("CORS error - API not accessible from browser");
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Network error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Вхід в систему</h1>
          <p>Введіть ваші облікові дані для доступу</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Логін *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Введіть логін"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Введіть пароль"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <div className="login-footer">
          <p>Тільки для персоналу бригади</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
