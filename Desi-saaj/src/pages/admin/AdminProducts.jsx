import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./../../css/AdminProducts.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  /* ✅ Fetch Products */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Delete Product */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted ✅");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-products-container">
        <h1>All Products</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="product-img"
                    />
                  </td>

                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stockStatus}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/admin/edit-product/${product._id}`)
                      }
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
