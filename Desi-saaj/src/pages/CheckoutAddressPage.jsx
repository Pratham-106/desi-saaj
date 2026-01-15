import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../context/checkout/useCheckout";
import "./../css/Checkout.css";

export default function CheckoutAddressPage() {
  const navigate = useNavigate();
  const { setAddress } = useCheckout();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Pincode must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setAddress(form);
    navigate("/checkout/payment");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="checkout-address-page">
      <div className="checkout-address-container">
        <h1>Delivery Address</h1>
        <p className="form-subtitle">Please provide your delivery details</p>

        <form onSubmit={submitHandler} className="address-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your street address, apartment, suite, etc."
              rows="3"
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          {/* City & State */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? "error" : ""}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                id="state"
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className={errors.state ? "error" : ""}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <input
              id="pincode"
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="6-digit postal code"
              className={errors.pincode ? "error" : ""}
            />
            {errors.pincode && <span className="error-text">{errors.pincode}</span>}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Continue to Payment
            </button>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="back-btn"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
