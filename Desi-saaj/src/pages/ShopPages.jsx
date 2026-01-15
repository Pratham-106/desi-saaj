import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./../css/ShopPage.css";

const API = "http://localhost:5000/api";

export default function ShopPages() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const url =
        activeCategory === "ALL"
          ? `${API}/products`
          : `${API}/products?category=${activeCategory}`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [activeCategory]);

  const categories = ["ALL", "Kurtis", "Western", "Traditional"];

  return (
    <div className="shop-page-container">
      <h1 className="shop-title">Shop</h1>

      {/* CATEGORY TABS */}
      <div className="shop-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`shop-tab ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "ALL" ? "All " : cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="loading-text">No products found.</p>
      ) : (
        <div className="shop-products-grid">
          {products.map((product) => (
            <div key={product._id} className="shop-product-card">
              <Link to={`/product/${product._id}`}>
                <img
                  src={`http://localhost:5000${
                    product.images?.[0] || "/no-img.png"
                  }`}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/no-img.png")}
                />
              </Link>

              <Link
                to={`/product/${product._id}`}
                className="product-link"
              >
                <h3>{product.name}</h3>
              </Link>

              <p className="price">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
