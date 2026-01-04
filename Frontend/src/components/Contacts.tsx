import React, { useState } from "react";
import "./Contacts.css";
import contactsBackImage from "../img/backgrounds/Contacts/Contacts-back.jpg";
import Footer from "./Footer";
import { sendContactMessage, ContactFormData } from "../services/contactApi";

const Contacts: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await sendContactMessage(formData);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="kontakty-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${contactsBackImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="content-section">
        <div className="container">
          <div className="contact-info-unified">
            <h2>Контактна інформація</h2>

            <div className="contact-item-unified">
              <div className="contact-icon">📞</div>
              <div className="contact-text">
                <span className="contact-label">Телефон:</span>
                <span className="contact-value">+380 (93) 38 02 208</span>
              </div>
            </div>

            <div className="contact-item-unified">
              <div className="contact-icon">✉️</div>
              <div className="contact-text">
                <span className="contact-label">Email:</span>
                <span className="contact-value">arsenalsadn@ukr.net</span>
              </div>
            </div>

            <div className="social-divider"></div>

            <div className="social-media-unified">
              <h3>Соціальні мережі</h3>
              <div className="social-icons-row">
                <a
                  href="https://www.facebook.com/groups/546401331898688"
                  className="social-icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg
                    className="social-icon-unified"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@arsenalsadn"
                  className="social-icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg
                    className="social-icon-unified"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/arsenalsadn?igsh=MWNiYWt0dnhjanZsMA=="
                  className="social-icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg
                    className="social-icon-unified"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-wide">
            <h2>Напишіть нам</h2>
            <form className="form" onSubmit={handleSubmit}>
              {submitStatus === "success" && (
                <div
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  ✅ Повідомлення успішно надіслано!
                </div>
              )}
              {submitStatus === "error" && (
                <div
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  ❌ Помилка при надсиланні повідомлення. Спробуйте ще раз.
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Ім'я *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Ваш email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Ваш телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Повідомлення *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Ваше повідомлення"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Надсилання..." : "Надіслати повідомлення"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacts;
