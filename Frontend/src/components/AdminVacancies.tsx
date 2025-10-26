import React, { useState, useEffect } from "react";
import "./AdminVacancies.css";
import {
  vacanciesApiService,
  VacancyCreateModel,
  Vacancy,
} from "../services/vacanciesApi";

interface VacancyFormData {
  title: string;
  description: string;
  contactPhone: string;
}

const AdminVacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    vacancyId: number | null;
    vacancyTitle: string;
  }>({
    isOpen: false,
    vacancyId: null,
    vacancyTitle: "",
  });
  const [formData, setFormData] = useState<VacancyFormData>({
    title: "",
    description: "",
    contactPhone: "",
  });

  // Fetch vacancies from API
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vacanciesApiService.getAllVacancies();
        setVacancies(data);
      } catch (error) {
        console.error("Failed to fetch vacancies:", error);
        setError("Помилка завантаження вакансій");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const openModal = (vacancy?: Vacancy) => {
    if (vacancy) {
      setEditingVacancy(vacancy);
      setFormData({
        title: vacancy.title,
        description: vacancy.description,
        contactPhone: vacancy.contactPhone,
      });
    } else {
      setEditingVacancy(null);
      setFormData({
        title: "",
        description: "",
        contactPhone: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVacancy(null);
    setFormData({
      title: "",
      description: "",
      contactPhone: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVacancy) {
        // Update existing vacancy
        const updatedVacancy: VacancyCreateModel = {
          id: editingVacancy.id,
          ...formData,
          requirements: [],
          salary: "",
          employmentType: "",
          educationLevel: "",
          postedDate: editingVacancy.postedDate,
        };
        const result = await vacanciesApiService.updateVacancy(updatedVacancy);
        setVacancies((prev) =>
          prev.map((v) => (v.id === editingVacancy.id ? result : v))
        );
        showNotification("Вакансію успішно оновлено", "success");
      } else {
        // Create new vacancy
        const newVacancy: VacancyCreateModel = {
          ...formData,
          requirements: [],
          salary: "",
          employmentType: "",
          educationLevel: "",
          postedDate: new Date().toISOString(),
        };
        const result = await vacanciesApiService.createVacancy(newVacancy);
        setVacancies((prev) => [...prev, result]);
        showNotification("Вакансію успішно додано", "success");
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save vacancy:", error);
      showNotification("Помилка збереження вакансії", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      vacancyId: id,
      vacancyTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      vacancyId: null,
      vacancyTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.vacancyId) {
      try {
        await vacanciesApiService.deleteVacancy(deleteConfirm.vacancyId);
        setVacancies((prev) =>
          prev.filter((v) => v.id !== deleteConfirm.vacancyId)
        );
        showNotification("Вакансію успішно видалено", "success");
        closeDeleteConfirm();
      } catch (error) {
        console.error("Failed to delete vacancy:", error);
        showNotification("Помилка видалення вакансії", "error");
      }
    }
  };

  return (
    <div className="admin-vacancies">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
            title="Закрити"
          >
            ×
          </button>
        </div>
      )}

      <div className="section-header">
        <h2>Управління вакансіями</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Додати вакансію
        </button>
      </div>

      {loading ? (
        <div className="loading">Завантаження вакансій...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="vacancies-list">
          {vacancies.length === 0 ? (
            <div className="no-vacancies">Ви ще не додали жодної вакансії</div>
          ) : (
            vacancies.map((vacancy) => (
              <div key={vacancy.id} className="vacancy-item">
                <h3 className="vacancy-title">{vacancy.title}</h3>
                <span className="vacancy-date">
                  {new Date(vacancy.postedDate).toLocaleDateString("uk-UA")}
                </span>
                <div className="vacancy-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => openModal(vacancy)}
                    title="Редагувати"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => openDeleteConfirm(vacancy.id, vacancy.title)}
                    title="Видалити"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingVacancy ? "Редагувати вакансію" : "Додати вакансію"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="vacancy-form">
              <div className="form-group">
                <label htmlFor="title">Назва вакансії *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Опис вакансії *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Контактний телефон *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+380 (93) 38 02 208"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Скасувати
                </button>
                <button type="submit" className="save-btn">
                  {editingVacancy ? "Оновити" : "Додати"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteConfirm}>
          <div
            className="delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-header">
              <div className="delete-icon">🗑️</div>
              <h3>Підтвердження видалення</h3>
            </div>
            <div className="delete-confirm-content">
              <p>
                Ви впевнені, що хочете видалити вакансію{" "}
                <strong>"{deleteConfirm.vacancyTitle}"</strong>?
              </p>
              <p className="delete-warning">Ця дія не може бути скасована.</p>
            </div>
            <div className="delete-confirm-actions">
              <button
                className="cancel-delete-btn"
                onClick={closeDeleteConfirm}
              >
                Скасувати
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVacancies;
