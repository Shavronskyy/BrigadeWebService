import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import mainBackImage from "../img/backgrounds/Home/main-back.jpg";
import Footer from "./Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
