import { useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import "./../../css/AdminAddProduct.css";

/* ✅ DEPLOYMENT SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminAddProduct() {
  /* ✅ Admin Info */
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  /* ✅ Form State */
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockStatus: "IN_STOCK",
    category: "",
    description: "",
    tags: [],
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ============================
     ✅ HANDLE TEXT INPUTS
  ============================ */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ============================
     ✅ TRENDING CHECKBOX
  ============================ */
  const handleTrendingChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.checked ? ["TRENDING"] : [],
    });
  };

  /* ============================
     ✅ IMAGE UPLOAD
  ============================ */
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  /* ============================
     ✅ SUBMIT PRODUCT
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* ✅ FormData for Cloudinary Upload */
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stockStatus", formData.stockStatus);
      data.append("category", formData.category);
      data.append("description", formData.description);

      /* ✅ Tags */
      formData.tags.forEach((tag) => {
        data.append("tags", tag);
      });

      /* ✅ Images (Cloudinary) */
      images.forEach((img) => {
        data.append("images", img);
      });

      /* ✅ ADMIN AUTH REQUIRED */
      await axios.post(`${API}/products/add`, data, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Product added successfully!");

      /* ✅ Reset Form */
      setFormData({
        name: "",
        price: "",
        stockStatus: "IN_STOCK",
        category: "",
        description: "",
        tags: [],
      });

      setImages([]);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "❌ Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="add-product-container">
        <h1>Add New Product</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* ✅ PRODUCT NAME */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ PRICE + STOCK */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Status</label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                required
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="LIMITED">Limited Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* ✅ CATEGORY */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Kurtis">Kurtis</option>
              <option value="Western">Western</option>
              <option value="Traditional">Traditional</option>
            </select>
          </div>

          {/* ✅ TRENDING TAG */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.tags.includes("TRENDING")}
                onChange={handleTrendingChange}
              />
              Mark as Trending
            </label>
          </div>

          {/* ✅ DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ IMAGES */}
          <div className="form-group">
            <label>Upload up to 5 Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {/* ✅ SUBMIT */}
          <button className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
