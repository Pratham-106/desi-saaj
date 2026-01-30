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

  /* ✅ Image Upload Limit Fix */
  const handleImageChange = (e) => {
    const files = [...e.target.files];

    if (files.length > 2) {
      toast.error("Only 2 images allowed (Render free limit)");
      return;
    }

    setImages(files);
  };

  /* ✅ Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stockStatus", formData.stockStatus);
      data.append("category", formData.category);
      data.append("description", formData.description);

      formData.tags.forEach((tag) => data.append("tags", tag));

      images.forEach((file) => data.append("images", file));

      await axios.post(`${API}/products/add`, data, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Product added successfully!");

      /* ✅ Reset */
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
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Upload Failed"
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
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="stockStatus"
            value={formData.stockStatus}
            onChange={handleChange}
          >
            <option value="IN_STOCK">In Stock</option>
            <option value="LIMITED">Limited</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

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

          <label>
            <input
              type="checkbox"
              checked={formData.tags.includes("TRENDING")}
              onChange={handleTrendingChange}
            />
            Mark as Trending
          </label>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
