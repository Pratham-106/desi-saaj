import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminAddProduct.css";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "Kurtis",
    stockStatus: "IN_STOCK",
    description: "",
    deliveryCharge: 0,
    tags: [], // 🔥 NEW
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}`);

      setProduct({
        name: res.data.name,
        price: res.data.price,
        category: res.data.category,
        stockStatus: res.data.stockStatus,
        description: res.data.description,
        deliveryCharge: res.data.deliveryCharge || 0,
        tags: res.data.tags || [], // 🔥 LOAD TAGS
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  /* 🔥 HANDLE TRENDING TOGGLE */
  const handleTrendingChange = (e) => {
    if (e.target.checked) {
      setProduct({ ...product, tags: ["TRENDING"] });
    } else {
      setProduct({ ...product, tags: [] });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API}/products/${id}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading product...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1>Edit Product</h1>

      <form onSubmit={submitHandler} className="add-product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option>Kurtis</option>
            <option>Western</option>
            <option>Traditional</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Status</label>
            <select
              name="stockStatus"
              value={product.stockStatus}
              onChange={handleChange}
              required
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="LIMITED">Limited Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* 🔥 TRENDING CHECKBOX */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={product.tags.includes("TRENDING")}
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
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Update Product
        </button>
      </form>
    </AdminLayout>
  );
}
