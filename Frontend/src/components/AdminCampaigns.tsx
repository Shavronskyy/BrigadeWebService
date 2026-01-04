import React, { useState, useEffect } from "react";
import "./AdminCampaigns.css";
import {
  campaignsApiService,
  CampaignCreateModel,
  Campaign,
} from "../services/campaignsApi";

interface CampaignFormData {
  title: string;
  description: string;
  goal: string;
  date: string;
  image: string;
  link: string;
}

const AdminCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    campaignId: number | null;
    campaignTitle: string;
  }>({
    isOpen: false,
    campaignId: null,
    campaignTitle: "",
  });
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    goal: "",
    date: "",
    image: "",
    link: "",
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await campaignsApiService.getAllCampaigns();
        setCampaigns(data);
      } catch (error) {
        setError("Помилка завантаження зборів");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const openModal = (campaign?: Campaign) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        title: campaign.title,
        description: campaign.description,
        goal: campaign.goal,
        date: campaign.date,
        image: campaign.image,
        link: campaign.link,
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        title: "",
        description: "",
        goal: "",
        date: "",
        image: "",
        link: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
    setFormData({
      title: "",
      description: "",
      goal: "",
      date: "",
      image: "",
      link: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCampaign) {
        const updatedCampaign: CampaignCreateModel = {
          id: editingCampaign.id,
          ...formData,
          isCompleted: editingCampaign.isCompleted,
          createdAt: editingCampaign.createdAt,
        };
        const result = await campaignsApiService.updateCampaign(
          updatedCampaign
        );
        setCampaigns((prev) =>
          prev.map((c) => (c.id === editingCampaign.id ? result : c))
        );
        showNotification("Збір успішно оновлено", "success");
      } else {
        const newCampaign: CampaignCreateModel = {
          ...formData,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        };
        const result = await campaignsApiService.createCampaign(newCampaign);
        setCampaigns((prev) => [...prev, result]);
        showNotification("Збір успішно додано", "success");
      }

      closeModal();
    } catch (error) {
      showNotification("Помилка збереження збору", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      campaignId: id,
      campaignTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      campaignId: null,
      campaignTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.campaignId) {
      try {
        await campaignsApiService.deleteCampaign(deleteConfirm.campaignId);
        setCampaigns((prev) =>
          prev.filter((c) => c.id !== deleteConfirm.campaignId)
        );
        showNotification("Збір успішно видалено", "success");
        closeDeleteConfirm();
      } catch (error) {
        showNotification("Помилка видалення збору", "error");
      }
    }
  };

  const toggleCampaignStatus = async (id: number) => {
    try {
      const result = await campaignsApiService.toggleCampaignStatus(id);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? result : c)));
      showNotification(
        result.isCompleted ? "Збір позначено як завершений" : "Збір активовано",
        "success"
      );
    } catch (error) {
      showNotification("Помилка зміни статусу збору", "error");
    }
  };

  return (
    <div className="admin-campaigns">
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
        <h2>Управління зборами</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Додати збір
        </button>
      </div>

      {loading ? (
        <div className="loading">Завантаження зборів...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="campaigns-table">
          <table>
            <thead>
              <tr>
                <th>Зображення</th>
                <th>Назва</th>
                <th>Мета</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    Ви ще не додали жодного збору
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="campaign-image-cell">
                      <img src={campaign.image} alt={campaign.title} />
                    </td>
                    <td className="campaign-title-cell">{campaign.title}</td>
                    <td>{campaign.goal}</td>
                    <td>{campaign.date}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          campaign.isCompleted ? "completed" : "active"
                        }`}
                      >
                        {campaign.isCompleted ? "Завершено" : "Активний"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => openModal(campaign)}
                        title="Редагувати"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn toggle"
                        onClick={() => toggleCampaignStatus(campaign.id)}
                        title={
                          campaign.isCompleted ? "Активувати" : "Завершити"
                        }
                      >
                        {campaign.isCompleted ? "🔄" : "✅"}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          openDeleteConfirm(campaign.id, campaign.title)
                        }
                        title="Видалити"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCampaign ? "Редагувати збір" : "Додати збір"}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="campaign-form">
              <div className="form-group">
                <label htmlFor="title">Назва збору *</label>
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
                <label htmlFor="description">Опис збору *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goal">Мета збору *</label>
                  <input
                    type="text"
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="Наприклад: 49 000 000 €"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Дата *</label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="Наприклад: 10.12.2024"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">URL зображення *</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Введіть URL зображення"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="link">Посилання на збір</label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="Введіть посилання на збір"
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
                  {editingCampaign ? "Оновити" : "Додати"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                Ви впевнені, що хочете видалити збір{" "}
                <strong>"{deleteConfirm.campaignTitle}"</strong>?
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

export default AdminCampaigns;
