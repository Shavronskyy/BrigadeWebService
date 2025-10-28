import React, { useState, useEffect } from "react";
import "./AdminPosts.css";
import {
  postsApiService,
  PostCreateModel,
  Post,
  PostUpdateModel,
} from "../services/postsApi";

interface PostFormData {
  title: string;
  shortText: string;
  content: string;
}

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    postId: number | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  });
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    shortText: "",
    content: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postsApiService.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError("Помилка завантаження постів");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const openModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        shortText: post.shortText,
        content: post.content,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        shortText: "",
        content: "",
      });
    }
    setSelectedFiles(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({
      title: "",
      shortText: "",
      content: "",
    });
    setSelectedFiles(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const postData: PostCreateModel = {
        title: formData.title,
        shortText: formData.shortText,
        content: formData.content,
        createdAt: new Date().toISOString(),
        photos: selectedFiles ? Array.from(selectedFiles) : [],
      };

      if (editingPost) {
        const updateData: PostUpdateModel = {
          ...postData,
          id: editingPost.id,
        };
        await postsApiService.updatePost(updateData);
        showNotification("Пост успішно оновлено", "success");
      } else {
        await postsApiService.createPost(postData);
        showNotification("Пост успішно створено", "success");
      }

      // Refresh the posts list
      const updatedPosts = await postsApiService.getAllPosts();
      setPosts(updatedPosts);
      closeModal();
    } catch (error) {
      console.error("Failed to save post:", error);
      setError(
        editingPost ? "Помилка оновлення поста" : "Помилка створення поста"
      );
      showNotification(
        editingPost ? "Помилка оновлення поста" : "Помилка створення поста",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      setLoading(true);
      setError(null);
      await postsApiService.deletePost(postId);
      showNotification("Пост успішно видалено", "success");

      // Refresh the posts list
      const updatedPosts = await postsApiService.getAllPosts();
      setPosts(updatedPosts);
      setDeleteConfirm({ isOpen: false, postId: null, postTitle: "" });
    } catch (error) {
      console.error("Failed to delete post:", error);
      setError("Помилка видалення поста");
      showNotification("Помилка видалення поста", "error");
    } finally {
      setLoading(false);
    }
  };

  const openImageViewer = (imageUrl: string, alt: string) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAlt(alt);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setSelectedImageUrl("");
    setSelectedImageAlt("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="admin-posts">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження постів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-posts">
      <div className="admin-posts-header">
        <h2>Управління постами</h2>
        <button
          className="btn btn-primary"
          onClick={() => openModal()}
          disabled={loading}
        >
          <span className="btn-icon">➕</span>
          Додати пост
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === "success" ? "✅" : "❌"}
          </span>
          {notification.message}
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Немає постів</h3>
            <p>Створіть перший пост, щоб почати публікацію новин</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-preview">
                {post.images && post.images.length > 0 && (
                  <div className="post-image-preview">
                    <img
                      src={post.images[0].url}
                      alt={post.title}
                      onClick={() =>
                        openImageViewer(post.images[0].url, post.title)
                      }
                    />
                    {post.images.length > 1 && (
                      <div className="image-count">
                        +{post.images.length - 1}
                      </div>
                    )}
                  </div>
                )}
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-short-text">{post.shortText}</p>
                  <div className="post-meta">
                    <span className="post-date">
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="post-images-count">
                      {post.images?.length || 0} зображень
                    </span>
                  </div>
                </div>
              </div>
              <div className="post-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => openModal(post)}
                  disabled={loading}
                >
                  <span className="btn-icon">✏️</span>
                  Редагувати
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: true,
                      postId: post.id,
                      postTitle: post.title,
                    })
                  }
                  disabled={loading}
                >
                  <span className="btn-icon">🗑️</span>
                  Видалити
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPost ? "Редагувати пост" : "Створити пост"}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="post-form">
              <div className="form-group">
                <label htmlFor="title">Заголовок *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Введіть заголовок поста"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shortText">Короткий опис *</label>
                <textarea
                  id="shortText"
                  name="shortText"
                  value={formData.shortText}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Введіть короткий опис поста"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Повний текст *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  placeholder="Введіть повний текст поста"
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Зображення</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="file-info">
                  {selectedFiles && selectedFiles.length > 0 && (
                    <p>Вибрано файлів: {selectedFiles.length}</p>
                  )}
                  {editingPost &&
                    editingPost.images &&
                    editingPost.images.length > 0 && (
                      <p>Поточні зображення: {editingPost.images.length}</p>
                    )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Збереження..."
                    : editingPost
                    ? "Оновити"
                    : "Створити"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm">
            <div className="modal-header">
              <h3>Підтвердження видалення</h3>
            </div>
            <div className="modal-body">
              <p>
                Ви впевнені, що хочете видалити пост "{deleteConfirm.postTitle}
                "?
              </p>
              <p className="warning-text">Цю дію неможливо скасувати!</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setDeleteConfirm({
                    isOpen: false,
                    postId: null,
                    postTitle: "",
                  })
                }
                disabled={loading}
              >
                Скасувати
              </button>
              <button
                className="btn btn-danger"
                onClick={() =>
                  deleteConfirm.postId && handleDelete(deleteConfirm.postId)
                }
                disabled={loading}
              >
                {loading ? "Видалення..." : "Видалити"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {isImageViewerOpen && (
        <div className="modal-overlay" onClick={closeImageViewer}>
          <div className="image-viewer" onClick={(e) => e.stopPropagation()}>
            <button className="image-viewer-close" onClick={closeImageViewer}>
              ×
            </button>
            <img src={selectedImageUrl} alt={selectedImageAlt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
