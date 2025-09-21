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
      console.error("Failed to send contact message:", error);
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
          <div className="contact-info-horizontal">
            <h2>Контактна інформація</h2>
            <div className="contact-items-row">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Телефон</h3>
                  <p>+380 (93) 38 02 208</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>arsenalsadn@ukr.net</p>
                </div>
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
