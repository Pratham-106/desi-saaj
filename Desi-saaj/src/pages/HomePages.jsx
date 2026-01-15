import "./../css/HomePage.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// local images
import heroImg from "./../assets/hero.jpeg";
import trending1 from "./../assets/ds.jpeg";
import trending2 from "./../assets/DS(1).jpeg";
import trending3 from "./../assets/DS(2).jpeg";

/* ✅ DEPLOYMENT SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function HomePages() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  /* 🔥 FETCH TRENDING PRODUCTS */
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${API}/products/trending`);
        setTrendingProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="home-pages-container">
      {/* HERO / CAROUSEL */}
      <section className="hero-section">
        <Carousel
          slides={[
            { id: 1, src: heroImg, caption: "Discover Indian Ethnic Fashion" },
            { id: 2, src: trending1, caption: "Elegant Kurtis & Sets" },
            { id: 3, src: trending2, caption: "Modern Western Fusion" },
            { id: 4, src: trending3, caption: "Traditional Classics" },
          ]}
        />
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section">
        <h2 className="section-title">Shop by Category</h2>

        <div className="category-grid">
          <Link to="/shop?category=Kurtis" className="category-card">
            <h3>Kurtis</h3>
          </Link>

          <Link to="/shop?category=Western" className="category-card">
            <h3>Western</h3>
          </Link>

          <Link to="/shop?category=Traditional" className="category-card">
            <h3>Traditional</h3>
          </Link>
        </div>
      </section>

      {/* 🔥 TRENDING PRODUCTS */}
      <section className="featured-section">
        <div className="trending-header">
          <h2 className="section-title">🔥 Trending Products</h2>
          <span className="sub">Hot picks everyone’s loving</span>
        </div>

        {loadingTrending ? (
          <p style={{ padding: "20px" }}>Loading trending products...</p>
        ) : trendingProducts.length === 0 ? (
          <p style={{ padding: "20px" }}>
            No trending products right now.
          </p>
        ) : (
          <div className="trending-scroll">
            {trendingProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                className="featured-card"
                key={product._id}
              >
                <img
                  src={`${API.replace("/api", "")}${product.images[0]}`}
                  alt={product.name}
                />
                <div className="featured-info">
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ==========================
   Carousel Component
========================== */
function Carousel({ slides = [], interval = 4000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [slides, interval]);

  const goTo = (index) => setCurrent(index);
  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () =>
    setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="carousel">
      <div className="carousel-track">
        {slides.map((s, i) => (
          <div
            key={s.id || i}
            className={`carousel-slide ${i === current ? "active" : ""}`}
          >
            <img
              src={s.src}
              alt={s.caption || `Slide ${i + 1}`}
              className="carousel-img"
            />
            {s.caption && (
              <div className="carousel-caption">{s.caption}</div>
            )}
          </div>
        ))}
      </div>

      <button className="carousel-control prev" onClick={prev}>
        ‹
      </button>
      <button className="carousel-control next" onClick={next}>
        ›
      </button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
