import React, { useState, useEffect } from "react";
import "./AdminDonations.css";
import {
  donationsApiService,
  DonationCreateModel,
  Donation,
  ReportCreateModel,
} from "../services/donationsApi";
import ReportImagesManager from "./ReportImagesManager";
import DonationImageManager from "./DonationImageManager";
import { API_CONFIG } from "../config/api";

interface DonationFormData {
  title: string;
  description: string;
  goal: string;
  donationLink: string;
}

interface ReportFormData {
  title: string;
  description: string;
  category: string;
}

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportsListModalOpen, setIsReportsListModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [reportDonation, setReportDonation] = useState<Donation | null>(null);
  const [editingReport, setEditingReport] = useState<any | null>(null);
  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [selectedDonationFile, setSelectedDonationFile] = useState<File | null>(
    null
  );
  const [selectedReportFiles, setSelectedReportFiles] =
    useState<FileList | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    donationId: number | null;
    donationTitle: string;
  }>({
    isOpen: false,
    donationId: null,
    donationTitle: "",
  });
  const [formData, setFormData] = useState<DonationFormData>({
    title: "",
    description: "",
    goal: "",
    donationLink: "",
  });
  const [reportFormData, setReportFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await donationsApiService.getAllDonations();

        // Fetch reports for each donation
        const donationsWithReports = await Promise.all(
          data.map(async (donation) => {
            try {
              const reports = await donationsApiService.getReportsByDonationId(
                donation.id
              );
              return {
                ...donation,
                reports: reports,
              };
            } catch (reportError) {
              // Return donation without reports if fetching reports fails
              return {
                ...donation,
                reports: [],
              };
            }
          })
        );

        setDonations(donationsWithReports);
      } catch (error) {
        let errorMessage = "Помилка завантаження зборів";

        if (error instanceof Error) {
          if (error.message.includes("Unexpected end of JSON input")) {
            errorMessage =
              "Сервер повернув порожню відповідь. Можливо, дані ще не додані.";
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage =
              "Не вдалося підключитися до сервера. Перевірте налаштування API.";
          } else if (error.message.includes("non-JSON response")) {
            errorMessage =
              "Сервер повернув некоректну відповідь. Перевірте налаштування API.";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const openModal = (donation?: Donation) => {
    if (donation) {
      setEditingDonation(donation);
      setFormData({
        title: donation.title,
        description: donation.description,
        goal: donation.goal.toString(),
        donationLink: donation.donationLink,
      });
    } else {
      setEditingDonation(null);
      setFormData({
        title: "",
        description: "",
        goal: "",
        donationLink: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDonation(null);
    setFormData({
      title: "",
      description: "",
      goal: "",
      donationLink: "",
    });
    setSelectedDonationFile(null);
  };

  const openReportModal = (donation: Donation, report?: any) => {
    setReportDonation(donation);
    if (report) {
      // Editing existing report
      setEditingReport(report);
      setCurrentReportId(report.id);
      setReportFormData({
        title: report.title || "",
        description: report.description || "",
        category: report.category || "",
      });
    } else {
      // Adding new report
      setEditingReport(null);
      setCurrentReportId(null);
      setReportFormData({
        title: "",
        description: "",
        category: "",
      });
    }
    setIsReportModalOpen(true);
  };

  const openReportsListModal = (donation: Donation) => {
    setReportDonation(donation);
    setIsReportsListModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportDonation(null);
    setEditingReport(null);
    setSelectedReportFiles(null);
    setReportFormData({
      title: "",
      description: "",
      category: "",
    });
  };

  const closeReportsListModal = () => {
    setIsReportsListModalOpen(false);
    setReportDonation(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReportInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedDonationFile(file);
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReportFiles(e.target.files);
  };

  const openImageViewer = (imageUrl: string, imageAlt: string) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAlt(imageAlt);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setSelectedImageUrl("");
    setSelectedImageAlt("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get current date in Kyiv timezone
      const now = new Date();
      const kyivTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Kiev" })
      );
      const creationDate = kyivTime.toISOString();

      const donationData: DonationCreateModel = {
        id: editingDonation?.id,
        title: formData.title,
        description: formData.description,
        goal: parseInt(formData.goal),
        creationDate: editingDonation?.creationDate || creationDate,
        donationLink: formData.donationLink,
        img: "", // Images are handled separately
        isCompleted: editingDonation?.isCompleted || false,
      };

      let result: Donation;

      if (editingDonation) {
        result = await donationsApiService.updateDonation(donationData);
        setDonations((prev) =>
          prev.map((d) => (d.id === editingDonation.id ? result : d))
        );
        showNotification("Збір успішно оновлено", "success");
      } else {
        // Create donation with image using the new endpoint
        if (selectedDonationFile) {
          // Use the new endpoint for creating donation with image
          const fd = new FormData();
          fd.append("Title", formData.title);
          fd.append("Description", formData.description);
          fd.append("Goal", formData.goal.toString());
          fd.append("DonationLink", formData.donationLink);
          fd.append("Photo", selectedDonationFile, selectedDonationFile.name);

          const donationFormDataArray = Array.from(fd.entries());
          donationFormDataArray.forEach((pair) => {
            // FormData entries processed
          });

          // Test if DonationsController endpoint is accessible
          try {
            const testResponse = await fetch(
              `${API_CONFIG.BASE_URL}/api/Donations`,
              {
                method: "GET",
                headers: { Accept: "application/json" },
              }
            );

          if (testResponse.status === 405) {
            // DonationsController exists but GET method not allowed - this is expected!
          } else if (testResponse.status === 404) {
            }
          } catch (testError) {
          }

          const createWithImageUrl = `${API_CONFIG.BASE_URL}/api/Donations/create`;

          let r;
          try {
            r = await fetch(createWithImageUrl, {
              method: "POST",
              body: fd,
            });
          } catch (fetchError) {
            const errorMessage =
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError);
            showNotification(`Network error: ${errorMessage}`, "error");
            return;
          }

          if (r.ok) {

            // Since backend might return Created() without body, refresh to get the new donation
            showNotification("Збір з фото успішно додано", "success");

            // Refresh the donations list to show the new donation
            const fetchDonations = async () => {
              try {
                const data = await donationsApiService.getAllDonations();
                setDonations(data);
              } catch (error) {
              }
            };
            await fetchDonations();
          } else {
            const errorText = await r.text();
            showNotification(`Помилка створення збору: ${errorText}`, "error");
            return;
          }
        } else {
          // Create donation without image using the old method
          const result = await donationsApiService.createDonation(donationData);
          setDonations((prev) => [...prev, result]);
          showNotification("Збір успішно додано", "success");
        }
      }

      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Помилка збереження збору";
      showNotification(errorMessage, "error");
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportDonation) return;

    try {
      const reportData: ReportCreateModel = {
        title: reportFormData.title,
        description: reportFormData.description,
        category: reportFormData.category,
        img: "", // Images are handled separately via ReportImagesManager
        donationId: reportDonation.id,
        createdAt: new Date().toISOString(),
      };

      if (editingReport) {
        // Update existing report
        // TODO: Implement update report API call when backend endpoint is available
        showNotification("Оновлення звітів поки не реалізовано", "error");
      } else {
        // Create new report with images using the new endpoint

        // Create FormData for the new endpoint
        const formData = new FormData();
        formData.append("Title", reportData.title);
        formData.append("Description", reportData.description);
        formData.append("Category", reportData.category);
        formData.append("DonationId", reportDonation.id.toString());

        // Add selected files if any
        if (selectedReportFiles && selectedReportFiles.length > 0) {
          for (const file of Array.from(selectedReportFiles)) {
            formData.append("Photos", file, file.name);
          }
        } else {
        }

        const formDataArray = Array.from(formData.entries());
        formDataArray.forEach((pair) => {
          // FormData entries processed
        });

        // Test if ReportsController basic endpoint works
        try {
          const testResponse = await fetch(
            `${API_CONFIG.BASE_URL}/api/Reports`,
            {
              method: "GET",
              headers: { Accept: "application/json" },
            }
          );

          if (testResponse.status === 405) {
            // ReportsController exists but GET method not allowed - this is expected!
          } else if (testResponse.status === 404) {
          }
        } catch (testError) {
        }

        // Use ReportsController create endpoint

        let response;
        try {
          response = await fetch(`${API_CONFIG.BASE_URL}/api/Reports/create`, {
            method: "POST",
            body: formData,
          });

        } catch (fetchError) {
          const errorMessage =
            fetchError instanceof Error
              ? fetchError.message
              : String(fetchError);
          showNotification(`Network error: ${errorMessage}`, "error");
          return;
        }


        if (response.ok) {

          // Since backend only returns Created() without body, we need to refresh to get the new report
          showNotification("Звіт з фото успішно створено", "success");

          // Refresh the donations list to show the new report
          const fetchDonations = async () => {
            try {
              const data = await donationsApiService.getAllDonations();
              setDonations(data);
            } catch (error) {
            }
          };
          await fetchDonations();
        } else {
          const errorText = await response.text();
          showNotification(
            `Помилка створення звіту (${response.status}): ${errorText}`,
            "error"
          );
          return;
        }
      }

      closeReportModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Помилка збереження звіту";
      showNotification(errorMessage, "error");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteIndividualReport = async (
    donationId: number,
    reportId: number
  ) => {
    // Individual report deletion is handled by the Reports API
    // This function is kept for potential future use
    try {
      await donationsApiService.deleteReport(reportId);
      showNotification("Звіт успішно видалено", "success");

      // Refresh the donations list to update the reports
      const data = await donationsApiService.getAllDonations();
      setDonations(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Помилка видалення звіту";
      showNotification(errorMessage, "error");
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      donationId: id,
      donationTitle: title,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      donationId: null,
      donationTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.donationId) {
      try {
        await donationsApiService.deleteDonation(deleteConfirm.donationId);
        setDonations((prev) =>
          prev.filter((d) => d.id !== deleteConfirm.donationId)
        );
        showNotification("Збір успішно видалено", "success");
        closeDeleteConfirm();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Помилка видалення збору";
        showNotification(errorMessage, "error");
      }
    }
  };

  const toggleDonationStatus = async (id: number) => {
    try {
      const donation = donations.find((d) => d.id === id);
      if (!donation) return;

      await donationsApiService.toggleDonationStatus(id);

      // Update local state by toggling the isCompleted status
      setDonations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, isCompleted: !d.isCompleted } : d
        )
      );

      showNotification(
        !donation.isCompleted
          ? "Збір позначено як завершений"
          : "Збір активовано",
        "success"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Помилка зміни статусу збору";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <div className="admin-donations">
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
        <div className="donations-list">
          {donations.length === 0 ? (
            <div className="no-donations">Ви ще не додали жодного збору</div>
          ) : (
            donations.map((donation) => {
              return (
                <div key={donation.id} className="donation-item">
                  {donation.img ? (
                    <img
                      src={
                        donation.img.startsWith("http")
                          ? donation.img
                          : `${API_CONFIG.BASE_URL}${donation.img}`
                      }
                      alt={donation.title}
                      className="donation-image"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="donation-image"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.8rem",
                      }}
                    >
                      Немає фото
                    </div>
                  )}

                  <div className="donation-content">
                    <h3 className="donation-title">{donation.title}</h3>
                    <div className="donation-details">
                      <span className="donation-goal">
                        Мета:{" "}
                        {donation.goal
                          ? donation.goal.toLocaleString()
                          : "Не вказано"}{" "}
                        ₴
                      </span>
                      <span className="donation-date">
                        {donation.creationDate
                          ? new Date(donation.creationDate).toLocaleDateString(
                              "uk-UA"
                            )
                          : "Не вказано"}
                      </span>
                    </div>
                    <button
                      className="reports-button"
                      onClick={() => openReportsListModal(donation)}
                      title="Переглянути звіти"
                    >
                      📊 Звіти про використання коштів (
                      {donation.reports ? donation.reports.length : 0})
                    </button>
                  </div>

                  <div className="donation-status">
                    <span
                      className={`status-badge ${
                        donation.isCompleted ? "completed" : "active"
                      }`}
                    >
                      {donation.isCompleted ? "Завершено" : "Активний"}
                    </span>
                  </div>

                  <div className="donation-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => openModal(donation)}
                      title="Редагувати"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn report"
                      onClick={() => openReportModal(donation)}
                      title={
                        donation.reports && donation.reports.length > 0
                          ? "Додати ще звіт"
                          : "Додати звіт"
                      }
                    >
                      📊
                    </button>
                    <button
                      className="action-btn toggle"
                      onClick={() => toggleDonationStatus(donation.id)}
                      title={donation.isCompleted ? "Активувати" : "Завершити"}
                    >
                      {donation.isCompleted ? "🔄" : "✅"}
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() =>
                        openDeleteConfirm(donation.id, donation.title)
                      }
                      title="Видалити"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDonation ? "Редагувати збір" : "Додати збір"}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="donation-form">
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

              <div className="form-group">
                <label htmlFor="goal">Мета збору (₴) *</label>
                <input
                  type="number"
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="1000000"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="donationLink">Посилання на збір</label>
                <input
                  type="url"
                  id="donationLink"
                  name="donationLink"
                  value={formData.donationLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/donation"
                />
              </div>

              <div className="form-group">
                <label>Зображення збору</label>
                {editingDonation ? (
                  <DonationImageManager donationId={editingDonation.id} />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDonationFileChange}
                      style={{ marginBottom: "10px" }}
                    />
                    {selectedDonationFile && (
                      <p style={{ color: "#666", fontSize: "0.9em" }}>
                        Вибрано: {selectedDonationFile.name}
                      </p>
                    )}
                  </div>
                )}
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
                  {editingDonation ? "Оновити" : "Додати"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReportModalOpen && reportDonation && (
        <div className="modal-overlay" onClick={closeReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingReport ? "Редагувати звіт" : "Додати звіт"}</h3>
              <button className="modal-close" onClick={closeReportModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="donation-form">
              <div className="form-group">
                <label htmlFor="title">Назва звіту *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={reportFormData.title}
                  onChange={handleReportInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Повний опис звіту *</label>
                <textarea
                  id="description"
                  name="description"
                  value={reportFormData.description}
                  onChange={handleReportInputChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Категорія *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={reportFormData.category}
                  onChange={handleReportInputChange}
                  required
                />
              </div>

              {!editingReport && (
                <div className="form-group">
                  <label>Зображення звіту</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReportFileChange}
                    style={{ marginBottom: "10px" }}
                  />
                  {selectedReportFiles && selectedReportFiles.length > 0 && (
                    <p style={{ color: "#666", fontSize: "0.9em" }}>
                      Вибрано {selectedReportFiles.length} фото
                    </p>
                  )}
                </div>
              )}

              {currentReportId && editingReport && (
                <div className="form-group">
                  <label>Управління зображеннями звіту</label>
                  <ReportImagesManager reportId={currentReportId} />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeReportModal}
                >
                  Скасувати
                </button>
                <button type="submit" className="save-btn">
                  {editingReport ? "Оновити звіт" : "Додати звіт"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List Modal */}
      {isReportsListModalOpen && reportDonation && (
        <div className="modal-overlay" onClick={closeReportsListModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Звіти про використання коштів: {reportDonation.title}</h3>
              <button className="modal-close" onClick={closeReportsListModal}>
                ×
              </button>
            </div>

            <div className="reports-list-container">
              {reportDonation.reports && reportDonation.reports.length > 0 ? (
                <div className="reports-list">
                  {reportDonation.reports.map((report: any, index: number) => (
                    <div key={index} className="report-item">
                      <div className="report-content">
                        <div className="report-header">
                          <div className="report-meta">
                            <p className="report-category">
                              Категорія: {report.category}
                            </p>
                            <p className="report-date">
                              Дата:{" "}
                              {report.createdAt
                                ? new Date(report.createdAt).toLocaleDateString(
                                    "uk-UA"
                                  )
                                : "Не вказано"}
                            </p>
                          </div>
                        </div>

                        <div className="report-title-section">
                          <p className="report-title-label">Назва</p>
                          <h4>{report.title}</h4>
                        </div>

                        <div className="report-description-section">
                          <p className="report-description-label">Опис</p>
                          <p className="report-description">
                            {report.description}
                          </p>
                        </div>

                        <div className="report-images">
                          {/* Show DTO images if available */}
                          {report.images && report.images.length > 0 ? (
                            <div className="report-images-grid">
                              {report.images.map(
                                (imageDto: any, imgIndex: number) => (
                                  <div
                                    key={imgIndex}
                                    className="report-image-item"
                                    onClick={() =>
                                      openImageViewer(
                                        imageDto.url,
                                        `${report.title} - Image ${
                                          imgIndex + 1
                                        }`
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <img
                                      src={imageDto.url}
                                      alt={`${report.title} - ${imgIndex + 1}`}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "100px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        margin: "2px",
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div
                              className="no-images"
                              style={{
                                color: "#666",
                                fontSize: "0.9em",
                                fontStyle: "italic",
                              }}
                            >
                              Немає зображень
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="report-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            closeReportsListModal();
                            openReportModal(reportDonation, report);
                          }}
                          title="Редагувати звіт"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reports">
                  <p>Поки що немає звітів для цього збору.</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="add-report-btn"
                onClick={() => {
                  closeReportsListModal();
                  openReportModal(reportDonation);
                }}
              >
                + Додати новий звіт
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={closeReportsListModal}
              >
                Закрити
              </button>
            </div>
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
                <strong>"{deleteConfirm.donationTitle}"</strong>?
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

      {/* Image Viewer Popup */}
      {isImageViewerOpen && (
        <div className="image-viewer-overlay" onClick={closeImageViewer}>
          <div
            className="image-viewer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="image-viewer-close" onClick={closeImageViewer}>
              ×
            </button>
            <img
              src={selectedImageUrl}
              alt={selectedImageAlt}
              className="image-viewer-img"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
