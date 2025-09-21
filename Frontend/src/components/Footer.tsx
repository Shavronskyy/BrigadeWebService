import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/" className="footer-link">
              Головна
            </a>
            <a href="/vacancies" className="footer-link">
              Вакансії
            </a>
            <a href="/contacts" className="footer-link">
              Контакти
            </a>
            <span className="footer-separator">|</span>
            <span className="footer-contact">+380 (93) 38 02 208</span>
            <span className="footer-separator">|</span>
            <a href="mailto:arsenalsadn@ukr.net" className="footer-link">
              arsenalsadn@ukr.net
            </a>
            <span className="footer-separator">|</span>
            <a
              href="https://www.facebook.com/groups/546401331898688"
              className="footer-link facebook-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="facebook-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 АРСЕНАЛ САДн ОПБр. Всі права захищені.</p>
            <p className="footer-motto">Слава Україні! Героям слава!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
