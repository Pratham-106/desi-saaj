import { useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import "./../../css/AdminAddProduct.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminAddProduct() {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

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

  /* ✅ Handle Inputs */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ✅ Trending */
  const handleTrendingChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.checked ? ["TRENDING"] : [],
    });
  };

  /* ✅ Images */
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  /* ✅ Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!adminInfo.token) {
      toast.error("Admin login required!");
      return;
    }

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stockStatus", formData.stockStatus);
      data.append("category", formData.category);
      data.append("description", formData.description);

      formData.tags.forEach((tag) => data.append("tags", tag));

      images.forEach((img) => data.append("images", img));

      await axios.post(`${API}/products/add`, data, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`, // ✅ REQUIRED
        },
      });

      toast.success("✅ Product Added Successfully!");

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
      console.error("UPLOAD ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message || "❌ Product upload failed"
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
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          {/* Stock */}
          <select
            name="stockStatus"
            value={formData.stockStatus}
            onChange={handleChange}
          >
            <option value="IN_STOCK">In Stock</option>
            <option value="LIMITED">Limited</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          {/* Category */}
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

          {/* Trending */}
          <label>
            <input
              type="checkbox"
              checked={formData.tags.includes("TRENDING")}
              onChange={handleTrendingChange}
            />
            Mark as Trending
          </label>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <button disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
