import "./../css/Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <h2>Desi Saaj</h2>
          <p>
            Elegant ethnic & contemporary fashion for women.
            Crafted with love in India.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <Link to="/shop?category=Kurtis">Kurtis</Link>
            <Link to="/shop?category=Western">Western</Link>
            <Link to="/shop?category=Traditional">Traditional</Link>
          </div>

          <div>
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About Us</Link>
            <Link to="/returns">Returns</Link>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>

        {/* CONTACT & SOCIAL */}
        <div className="footer-social">
          <h4>Contact Us</h4>

          <p>
            📧{" "}
            <a href="mailto:support@desisaaj.com">
              support@desisaaj.com
            </a>
          </p>

          <p>
            📞{" "}
            <a href="tel:+919876543210">
              +91 98765 43210
            </a>
          </p>

          <div className="social-icons">
            <a
              href="https://www.instagram.com/desisaaj/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
               @desisaaj-ig
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Desi Saaj. All rights reserved.
      </div>
    </footer>
  );
}
