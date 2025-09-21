import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Admin.css";
import AdminVacancies from "./AdminVacancies";
import AdminDonations from "./AdminDonations";

type AdminSection = "vacancies" | "donations";

const Admin: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("vacancies");

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <div className="admin-title">
              <h1>Панель адміністратора</h1>
              <p>Управління контентом та налаштування системи</p>
            </div>
            <div className="admin-actions">
              {/* Admin panel actions can be added here in the future */}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-navigation">
            <button
              className={`nav-btn ${
                activeSection === "vacancies" ? "active" : ""
              }`}
              onClick={() => setActiveSection("vacancies")}
            >
              <span className="nav-icon">💼</span>
              Вакансії
            </button>
            <button
              className={`nav-btn ${
                activeSection === "donations" ? "active" : ""
              }`}
              onClick={() => setActiveSection("donations")}
            >
              <span className="nav-icon">💰</span>
              Збори
            </button>
          </div>

          <div className="admin-section">
            {activeSection === "vacancies" && <AdminVacancies />}
            {activeSection === "donations" && <AdminDonations />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
