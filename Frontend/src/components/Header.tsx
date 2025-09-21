import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";
import adminPanelIcon from "../img/icons/admin-panel.png";
import logoutIcon from "../img/icons/logout.png";

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img
                src="/header-logo.svg"
                alt="Логотип бригади"
                className="logo-image"
              />
            </Link>
          </div>
        </div>

        <div
          className={`burger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Головна
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacts" className="nav-link" onClick={closeMenu}>
                Контакти
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/vacancies" className="nav-link" onClick={closeMenu}>
                Вакансії
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/support"
                className="nav-link support-btn"
                onClick={closeMenu}
              >
                Підтримати
              </Link>
            </li>
          </ul>

          {isAuthenticated ? (
            <div className="auth-buttons">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="nav-link admin-link icon-only"
                  onClick={closeMenu}
                  title="Адмін панель"
                >
                  <img
                    src={adminPanelIcon}
                    alt="Адмін панель"
                    className="icon-image"
                  />
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="nav-link logout-btn icon-only"
                title="Вийти"
              >
                <img src={logoutIcon} alt="Вийти" className="icon-image" />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link
                to="/login"
                className="nav-link login-link"
                onClick={closeMenu}
              >
                Увійти
              </Link>
              <Link
                to="/register"
                className="nav-link register-link"
                onClick={closeMenu}
              >
                Реєстрація
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
