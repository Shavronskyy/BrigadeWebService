import React, { useState, useEffect } from "react";
import "./VacancyApplicationPopup.css";
import {
  sendVacancyApplication,
  // VacancyApplicationData,
} from "../services/vacancyApplicationApi";

interface VacancyApplicationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  vacancyTitle: string;
}

const VacancyApplicationPopup: React.FC<VacancyApplicationPopupProps> = ({
  isOpen,
  onClose,
  vacancyTitle,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await sendVacancyApplication({
        vacancyTitle,
        name: formData.name,
        phone: formData.phone,
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        phone: "",
      });

      // Close popup after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit vacancy application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus("idle");
      setFormData({ name: "", phone: "" });
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Prevent ALL clicks outside our modal from doing anything
      const preventOutsideClicks = (e: MouseEvent) => {
        const target = e.target as Element;
        if (!target.closest(".brigade-vacancy-application-modal")) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      };

      // Add listener with capture=true to catch events before they bubble
      document.addEventListener("click", preventOutsideClicks, true);
      document.addEventListener("mousedown", preventOutsideClicks, true);
      document.addEventListener("mouseup", preventOutsideClicks, true);

      return () => {
        document.removeEventListener("click", preventOutsideClicks, true);
        document.removeEventListener("mousedown", preventOutsideClicks, true);
        document.removeEventListener("mouseup", preventOutsideClicks, true);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="brigade-vacancy-application-modal">
      <div className="brigade-vacancy-application-content">
        <button
          className="vacancy-popup-close"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2 className="vacancy-popup-title">Подача заявки</h2>
        <p className="vacancy-popup-subtitle">Вакансія: {vacancyTitle}</p>

        <form onSubmit={handleSubmit} className="vacancy-popup-form">
          {submitStatus === "success" && (
            <div className="vacancy-popup-success">
              ✅ Заявку успішно надіслано!
            </div>
          )}
          {submitStatus === "error" && (
            <div className="vacancy-popup-error">
              ❌ Помилка при надсиланні заявки. Спробуйте ще раз.
            </div>
          )}

          <div className="vacancy-popup-form-group">
            <label htmlFor="name" className="vacancy-popup-label">
              Ім'я *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Ваше ім'я"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="vacancy-popup-input"
            />
          </div>

          <div className="vacancy-popup-form-group">
            <label htmlFor="phone" className="vacancy-popup-label">
              Телефон *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Ваш телефон"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="vacancy-popup-input"
            />
          </div>

          <button
            type="submit"
            className="vacancy-popup-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Надсилання..." : "Подати заявку"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VacancyApplicationPopup;
