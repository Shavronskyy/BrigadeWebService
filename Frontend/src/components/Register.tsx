import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_CONFIG } from "../config/api";
import "./Register.css";

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (formData.username.length < 3) {
      setError("Ім'я користувача повинно містити мінімум 3 символи");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const url = `/api/Auth/register`;
      console.log("Sending registration request to:", url);
      console.log("Request body:", {
        username: formData.username,
        password: formData.password,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        setSuccess("Реєстрація успішна! Ви увійшли в систему.");

        // Auto-login after successful registration
        if (data.token) {
          // Create user object from registration response
          const userData = {
            id: data.id,
            username: data.username,
            email: data.email || "",
            role: "User", // Default role for new users
          };

          console.log("Auto-login with user data:", userData);
          login(data.token, userData);

          // Redirect after successful registration
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        let errorMessage = "Помилка реєстрації";
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

        if (response.status === 400) {
          errorMessage = "Користувач з таким іменем вже існує";
        }

        setError(errorMessage);
      }
    } catch (err) {
      console.error("Registration error details:", err);
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Помилка підключення до сервера");
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Невідома помилка";
        setError(`Помилка мережі: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Реєстрація</h1>
          <p>Створіть новий обліковий запис</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Ім'я користувача *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Введіть ім'я користувача (мін. 3 символи)"
              disabled={isLoading}
              minLength={3}
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
              placeholder="Введіть пароль (мін. 6 символів)"
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Підтвердження пароля *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Повторіть пароль"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </form>

        <div className="register-footer">
          <p>Вже маєте обліковий запис?</p>
          <button
            className="login-link-btn"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            Увійти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
