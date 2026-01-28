import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminProducts.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* ✅ Deployment Safe API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  /* ============================
     FETCH PRODUCTS
  ============================ */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     DELETE PRODUCT (ADMIN)
  ============================ */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted ✅");
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    }
  };

  /* ============================
     EDIT PRODUCT
  ============================ */
  const editProduct = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-products-container">
        <div className="products-header">
          <h1>All Products</h1>

          <button
            className="add-product-link"
            onClick={() => navigate("/admin/add-product")}
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      {/* ✅ Image Safe */}
                      <td>
                        <img
                          src={
                            product.images?.length > 0
                              ? `${BASE_URL}${product.images[0]}`
                              : "/placeholder.png"
                          }
                          alt={product.name}
                          className="product-img"
                        />
                      </td>

                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>

                      <td className="action-cells">
                        <button
                          className="edit-btn"
                          onClick={() => editProduct(product._id)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
