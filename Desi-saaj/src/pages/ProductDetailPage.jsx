import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/cart/useCart";
import "./../css/ProductDetailPage.css";
import ProductComments from "../components/ProductComments";

/* ✅ DEPLOYMENT-SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/products/${id}`);
        setProduct(res.data);
        setMainImage((res.data.images && res.data.images[0]) || "/uploads/placeholder.jpg");
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!product) return <p style={{ padding: "40px" }}>Product not found</p>;

  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      size: selectedSize,
      deliveryCharge: product.deliveryCharge || 0,
    });

    toast.success("Item added to cart 🛒");
  };

  const getStockLabel = () => {
    switch (product.stockStatus) {
      case "IN_STOCK":
        return <span className="stock in-stock">🟢 In Stock</span>;
      case "LIMITED":
        return <span className="stock limited-stock">🟡 Limited Stock</span>;
      case "OUT_OF_STOCK":
        return <span className="stock out-of-stock">🔴 Out of Stock</span>;
      default:
        return null;
    }
  };

  /* ✅ BASE URL FOR IMAGES */
  const IMAGE_BASE = API.replace("/api", "");

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* IMAGES */}
        <div className="product-images">
          <img
            src={`${IMAGE_BASE}${mainImage}`}
            alt={product.name}
            className="main-image"
          />

          <div className="thumbnail-row">
            {(product.images || []).map((img, index) => (
              <img
                key={index}
                src={`${IMAGE_BASE}${img}`}
                alt="thumb"
                className={`thumbnail ${
                  mainImage === img ? "active" : ""
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <p className="category">{product.category}</p>
          <p className="price">₹{product.price}</p>

          {/* STOCK STATUS */}
          <div className="stock-status">{getStockLabel()}</div>

          <p className="delivery-info">
            {product.deliveryCharge > 0
              ? ` Delivery Charge: ₹${product.deliveryCharge}`
              : " Free Delivery"}
          </p>

          <p className="description">{product.description}</p>

          {/* SIZE */}
          <div className="size-section">
            <p className="section-label">Select Size</p>
            <div className="size-options">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                  disabled={isOutOfStock}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
          </button>

          {/* TRUST */}
          <div className="trust-info">
            <p>🔁 Easy 7-Day Returns</p>
            <p>🔒 Secure Payments</p>
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <ProductComments
        productId={product._id}
        reviews={product.reviews || []}
      />
    </div>
  );
}
