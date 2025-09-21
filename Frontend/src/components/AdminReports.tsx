import React, { useState, useEffect } from "react";
import "./AdminReports.css";
import {
  reportsApiService,
  ReportCreateModel,
  Report,
} from "../services/reportsApi";
import ReportImagesManager from "./ReportImagesManager";
import { API_CONFIG } from "../config/api";

interface ReportDisplay {
  id: number;
  title: string;
  shortText: string;
  fullText: string;
  photo: string;
  date: string;
  category: string;
  isPublished: boolean;
}

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ReportDisplay[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportDisplay | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formData, setFormData] = useState<Omit<ReportDisplay, "id" | "photo">>(
    {
      title: "",
      shortText: "",
      fullText: "",
      date: "",
      category: "",
      isPublished: true,
    }
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    reportId: number | null;
    reportTitle: string;
  }>({
    isOpen: false,
    reportId: null,
    reportTitle: "",
  });
  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportsApiService.getAllReports();

        // Transform API data to display format
        const transformedReports: ReportDisplay[] = data.map((report) => ({
          id: report.id,
          title: report.title,
          shortText: report.shortDescription,
          fullText: report.description,
          photo: report.img || "",
          date: new Date(report.createdAt).toLocaleDateString("uk-UA"),
          category: report.category,
          isPublished: report.isPublished,
        }));

        setReports(transformedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Помилка завантаження звітів");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openModal = (report?: ReportDisplay) => {
    if (report) {
      setEditingReport(report);
      setCurrentReportId(report.id);
      setFormData({
        title: report.title,
        shortText: report.shortText,
        fullText: report.fullText,
        date: report.date,
        category: report.category,
        isPublished: report.isPublished,
      });
    } else {
      setEditingReport(null);
      setCurrentReportId(null);
      setFormData({
        title: "",
        shortText: "",
        fullText: "",
        date: new Date().toLocaleDateString("uk-UA"),
        category: "",
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
    setCurrentReportId(null);
    setSelectedFiles(null);
    setFormData({
      title: "",
      shortText: "",
      fullText: "",
      date: "",
      category: "",
      isPublished: true,
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
      console.log("Checkbox changed:", name, "checked:", checked);
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingReport) {
        // Update existing report
        const updatedReport: ReportCreateModel = {
          id: editingReport.id,
          title: formData.title,
          description: formData.fullText,
          shortDescription: formData.shortText,
          category: formData.category,
          img: editingReport.photo, // Keep existing image
          isPublished: formData.isPublished,
          createdAt: new Date().toISOString(),
        };

        const result = await reportsApiService.updateReport(updatedReport);

        // Transform API result to display format
        const transformedResult: ReportDisplay = {
          id: result.id,
          title: result.title,
          shortText: result.shortDescription,
          fullText: result.description,
          photo: result.img || "/img/report1.jpg",
          date: new Date(result.createdAt).toLocaleDateString("uk-UA"),
          category: result.category,
          isPublished: result.isPublished,
        };

        setReports((prev) =>
          prev.map((r) => (r.id === editingReport.id ? transformedResult : r))
        );
        showNotification("Звіт успішно оновлено", "success");
      } else {
        // Create new report with images using the new endpoint
        if (selectedFiles && selectedFiles.length > 0) {
          // Use the new endpoint for creating report with images
          const fd = new FormData();
          fd.append("Title", formData.title);
          fd.append("Description", formData.fullText);
          fd.append("Category", formData.category);
          fd.append("DonationId", "0"); // Reports can be standalone

          // Add all selected files
          for (const file of Array.from(selectedFiles)) {
            fd.append("Photos", file, file.name);
          }

          const r = await fetch(
            `${API_CONFIG.BASE_URL}/api/reports/create-with-images`,
            {
              method: "POST",
              body: fd,
            }
          );

          if (r.ok) {
            const result = await r.json();
            setCurrentReportId(result.id);
            showNotification("Звіт з фото створено", "success");

            // Refresh the reports list to show the new report
            const fetchReports = async () => {
              try {
                const data = await reportsApiService.getAllReports();
                const transformedReports: ReportDisplay[] = data.map(
                  (report) => ({
                    id: report.id,
                    title: report.title,
                    shortText: report.shortDescription,
                    fullText: report.description,
                    photo: report.img || "",
                    date: new Date(report.createdAt).toLocaleDateString(
                      "uk-UA"
                    ),
                    category: report.category,
                    isPublished: report.isPublished,
                  })
                );
                setReports(transformedReports);
              } catch (error) {
                console.error("Failed to refresh reports:", error);
              }
            };
            await fetchReports();
          } else {
            const errorText = await r.text();
            showNotification(`Помилка створення звіту: ${errorText}`, "error");
            return;
          }
        } else {
          // Create report without images using the old method
          const newReport: ReportCreateModel = {
            title: formData.title,
            description: formData.fullText,
            shortDescription: formData.shortText,
            category: formData.category,
            img: "",
            isPublished: formData.isPublished,
            createdAt: new Date().toISOString(),
          };

          const result = await reportsApiService.createReport(newReport);
          setCurrentReportId(result.id);

          // Transform API result to display format
          const transformedResult: ReportDisplay = {
            id: result.id,
            title: result.title,
            shortText: result.shortDescription,
            fullText: result.description,
            photo: result.img || "/img/report1.jpg",
            date: new Date(result.createdAt).toLocaleDateString("uk-UA"),
            category: result.category,
            isPublished: result.isPublished,
          };

          setReports((prev) => [...prev, transformedResult]);
          showNotification("Звіт успішно додано", "success");
        }
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save report:", error);
      showNotification("Помилка збереження звіту", "error");
    }
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      reportId: id,
      reportTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      reportId: null,
      reportTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.reportId) {
      try {
        await reportsApiService.deleteReport(deleteConfirm.reportId);
        setReports((prev) =>
          prev.filter((r) => r.id !== deleteConfirm.reportId)
        );
        showNotification("Звіт успішно видалено", "success");
        closeDeleteConfirm();
      } catch (error) {
        console.error("Failed to delete report:", error);
        showNotification("Помилка видалення звіту", "error");
      }
    }
  };

  const toggleReportStatus = async (id: number) => {
    try {
      const report = reports.find((r) => r.id === id);
      if (report) {
        const updatedReport: ReportCreateModel = {
          id: report.id,
          title: report.title,
          description: report.fullText,
          shortDescription: report.shortText,
          category: report.category,
          img: report.photo,
          isPublished: !report.isPublished,
          createdAt: new Date().toISOString(),
        };

        const result = await reportsApiService.updateReport(updatedReport);

        // Transform API result to display format
        const transformedResult: ReportDisplay = {
          id: result.id,
          title: result.title,
          shortText: result.shortDescription,
          fullText: result.description,
          photo: result.img || "/img/report1.jpg",
          date: new Date(result.createdAt).toLocaleDateString("uk-UA"),
          category: result.category,
          isPublished: result.isPublished,
        };

        setReports((prev) =>
          prev.map((r) => (r.id === id ? transformedResult : r))
        );

        showNotification(
          result.isPublished
            ? "Звіт успішно опубліковано"
            : "Звіт переведено в чернетку",
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to toggle report status:", error);
      showNotification("Помилка зміни статусу звіту", "error");
    }
  };

  const categories = [
    "Техніка",
    "Медицина",
    "Захист",
    "Зв'язок",
    "Логістика",
    "Навчання",
    "Інше",
  ];

  return (
    <div className="admin-reports">
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
        <h2>Управління звітами</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Додати звіт
        </button>
      </div>

      {loading ? (
        <div className="loading">Завантаження звітів...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="reports-list">
          {reports.length === 0 ? (
            <div className="no-reports">Ви ще не додали жодного звіту</div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="report-item">
                <h3 className="report-title">{report.title}</h3>
                <span className="report-date">{report.date}</span>
                <span
                  className={`status-badge ${
                    report.isPublished ? "published" : "draft"
                  }`}
                >
                  {report.isPublished ? "Опубліковано" : "Чернетка"}
                </span>
                <div className="report-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => openModal(report)}
                    title="Редагувати"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn toggle"
                    onClick={() => toggleReportStatus(report.id)}
                    title={
                      report.isPublished ? "Зняти з публікації" : "Опублікувати"
                    }
                  >
                    {report.isPublished ? "👁️" : "📝"}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => openDeleteConfirm(report.id, report.title)}
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
              <h3>{editingReport ? "Редагувати звіт" : "Додати звіт"}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Назва звіту *</label>
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
                  <label htmlFor="category">Категорія *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Виберіть категорію</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Дата *</label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="DD.MM.YYYY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Зображення звіту</label>
                  {!editingReport && (
                    <div style={{ marginBottom: "10px" }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ marginBottom: "10px" }}
                      />
                      {selectedFiles && selectedFiles.length > 0 && (
                        <p style={{ color: "#666", fontSize: "0.9em" }}>
                          Вибрано {selectedFiles.length} фото
                        </p>
                      )}
                    </div>
                  )}
                  {currentReportId ? (
                    <ReportImagesManager reportId={currentReportId} />
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        background: "#f5f5f5",
                        borderRadius: "5px",
                        color: "#666",
                      }}
                    >
                      <p>
                        📷{" "}
                        {editingReport
                          ? "Зображення керуються через ReportImagesManager"
                          : "Додайте фото вище або керуйте ними після створення звіту"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shortText">Короткий опис *</label>
                <textarea
                  id="shortText"
                  name="shortText"
                  value={formData.shortText}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Короткий опис для картки звіту"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fullText">Повний текст звіту *</label>
                <textarea
                  id="fullText"
                  name="fullText"
                  value={formData.fullText}
                  onChange={handleInputChange}
                  rows={8}
                  placeholder="Детальний опис події або отриманої допомоги"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                />
                <label>
                  <span className="toggle-text">
                    {formData.isPublished ? "✅ Опубліковано" : "⭕ Чернетка"}
                  </span>
                </label>
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
                  {editingReport ? "Оновити" : "Додати"}
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
                Ви впевнені, що хочете видалити звіт{" "}
                <strong>"{deleteConfirm.reportTitle}"</strong>?
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

export default AdminReports;
