import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import mainBackImage from "../img/backgrounds/Home/main-back.jpg";
import Footer from "./Footer";
import { postsApiService, Post } from "../services/postsApi";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsApiService.getAllPosts();
        setPosts(data);
      } catch (error) {
      }
    };

    fetchPosts();
  }, []);

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
  };

  const closePost = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedPost && selectedPost.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPost.images.length);
    }
  };

  const prevImage = () => {
    if (selectedPost && selectedPost.images.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedPost.images.length) % selectedPost.images.length
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const scrollToBlog = () => {
    const blogSection = document.querySelector(".blog-section");
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mainBackImage})`,
        }}
      >
        <div className="hero-content">
          <h1>АРСЕНАЛ</h1>
          <h2 className="hero-subtitle">
            САМОХІДНИЙ АРТИЛЕРІЙСЬКИЙ ДІВІЗІОН ОКРЕМОЇ ПРЕЗИДЕНТСЬКОЇ БРИГАДИ
          </h2>
          <div className="hero-actions">
            <div className="hero-left">
              <button
                className="hero-btn"
                onClick={() => navigate("/vacancies")}
              >
                Приєднуйся до нас!
              </button>
            </div>
            <div className="hero-right">
              <button className="hero-btn" onClick={() => navigate("/support")}>
                Підтримати
              </button>
            </div>
          </div>

          {/* Scroll Down Arrow */}
          <div className="scroll-indicator" onClick={scrollToBlog}>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      {posts.length > 0 && (
        <div
          className="blog-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mainBackImage})`,
          }}
        >
          <div className="container">
            <h2 className="section-title">Блог</h2>
            <div className="posts-grid">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="post-card"
                  onClick={() => openPost(post)}
                >
                  {post.images && post.images.length > 0 && (
                    <div className="post-image">
                      <img src={post.images[0].url} alt={post.title} />
                    </div>
                  )}
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-short-text">{post.shortText}</p>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {selectedPost && (
        <div className="post-modal" onClick={closePost}>
          <div
            className="post-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closePost}>
              ×
            </button>

            <h2 className="modal-title">{selectedPost.title}</h2>

            {/* Image Carousel with Dash Navigation */}
            {selectedPost.images && selectedPost.images.length > 0 && (
              <div className="carousel-container">
                <div className="carousel-slide">
                  <img
                    src={selectedPost.images[currentImageIndex].url}
                    alt={`${selectedPost.title} - ${currentImageIndex + 1}`}
                  />
                </div>

                {selectedPost.images.length > 1 && (
                  <>
                    <button
                      className="carousel-button carousel-prev"
                      onClick={prevImage}
                    >
                      &#8249;
                    </button>
                    <button
                      className="carousel-button carousel-next"
                      onClick={nextImage}
                    >
                      &#8250;
                    </button>

                    {/* Dash Navigation */}
                    <div className="carousel-dashes">
                      {selectedPost.images.map((_, index) => (
                        <button
                          key={index}
                          className={`carousel-dash ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                          onClick={() => goToImage(index)}
                        >
                          -
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="modal-body">
              <p className="post-content-text">{selectedPost.content}</p>
              <span className="post-date-full">
                {new Date(selectedPost.createdAt).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
