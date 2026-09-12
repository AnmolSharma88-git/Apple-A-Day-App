import React, { useState } from "react";
import "../support.css";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (!review.trim()) {
      alert("Please write a review.");
      return;
    }

    const reviewData = {
      rating,
      review: review.trim(),
    };

    if (onSubmit) {
      onSubmit(reviewData);
    }

    setSubmitted(true);
    setRating(0);
    setReview("");
  };

  return (
    <div className="support-card">
      <div className="timeline-header">
        <h2 className="timeline-title">
          Write a Review
        </h2>

        <p className="timeline-type">
          Share your experience with Apple A Day.
        </p>
      </div>

      {submitted && (
        <div className="review-success">
          ✓ Thank you! Your review has been submitted.
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Rating */}
        <div className="review-field">
          <label className="review-label">
            Rating
          </label>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} stars`}
                onClick={() => {
                  setRating(star);
                  setSubmitted(false);
                }}
                className={`review-star ${
                  star <= rating ? "selected" : ""
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="review-rating-text">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review */}
        <div className="review-field">
          <label
            htmlFor="review"
            className="review-label"
          >
            Your Review
          </label>

          <textarea
            id="review"
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Tell us about your food, pickup or delivery experience..."
            rows={5}
            maxLength={500}
            className="review-textarea"
          />

          <div className="review-character-count">
            {review.length}/500
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="review-submit-button"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;