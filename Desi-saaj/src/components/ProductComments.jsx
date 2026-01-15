import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user/useUser";
import toast from "react-hot-toast";
import "./../css/ProductComments.css";

const API = "http://localhost:5000/api";

export default function ProductComments({ productId, reviews = [] }) {
  const { user } = useUser();
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [localReviews, setLocalReviews] = useState(reviews);

  /* 🔵 ADD COMMENT */
  const submitComment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/products/${productId}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLocalReviews(res.data.reviews);
      setComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  /* ❤️ LIKE COMMENT */
  const toggleLike = async (reviewId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.put(
        `${API}/products/${productId}/comment/${reviewId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLocalReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, likes: new Array(res.data.likesCount) }
            : r
        )
      );
    } catch (error) {
      toast.error("Failed to like comment");
    }
  };

  return (
    <div className="comments-section">
      <h2>Customer Comments</h2>

      {/* ADD COMMENT */}
      <div className="add-comment-box">
        <textarea
          placeholder={
            user ? "Write your comment..." : "Login to write a comment"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user}
        />
        <button onClick={submitComment}>Post Comment</button>
      </div>

      {/* COMMENTS LIST */}
      {localReviews.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first!</p>
      ) : (
        <div className="comments-list">
          {localReviews.map((review) => (
            <div key={review._id} className="comment-card">
              <div className="comment-header">
                <strong>{review.name}</strong>
                <span>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="comment-text">{review.comment}</p>

              <button
                className="like-btn"
                onClick={() => toggleLike(review._id)}
              >
                ❤️ {review.likes.length}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
