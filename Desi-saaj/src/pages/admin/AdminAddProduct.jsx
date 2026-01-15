import { useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminAddProduct.css";

export default function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockStatus: "IN_STOCK",
    category: "",
    description: "",
    tags: [], // 🔥 NEW
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle text & select inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkbox (Trending)
  const handleTrendingChange = (e) => {
    if (e.target.checked) {
      setFormData({ ...formData, tags: ["TRENDING"] });
    } else {
      setFormData({ ...formData, tags: [] });
    }
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stockStatus", formData.stockStatus);
      data.append("category", formData.category);
      data.append("description", formData.description);

      // 🔥 TAGS
      formData.tags.forEach((tag) => {
        data.append("tags", tag);
      });

      images.forEach((img) => {
        data.append("images", img);
      });

      await axios.post(
        "http://localhost:5000/api/products/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Product added successfully!");
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
      setMessage("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="add-product-container">
        <h1>Add New Product</h1>

        {message && <p className="status-msg">{message}</p>}

        <form className="product-form" onSubmit={handleSubmit}>
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

          {/* 🔥 TRENDING CHECKBOX */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.tags.includes("TRENDING")}
                onChange={handleTrendingChange}
              />{" "}
              Mark as Trending
            </label>
          </div>

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

          <div className="form-group">
            <label>Upload 5 Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
