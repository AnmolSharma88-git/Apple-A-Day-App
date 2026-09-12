import React, { useState } from "react";

import ReviewForm from "../components/ReviewForm";

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      rating: 5,
      review:
        "The food was great and the ordering process was easy.",
      date: "Today",
    },
    {
      id: 2,
      rating: 4,
      review:
        "Pickup was quick and the order was ready on time.",
      date: "Yesterday",
    },
  ]);

  const handleReviewSubmit = (newReview) => {
    const review = {
      id: Date.now(),
      ...newReview,
      date: "Just now",
    };

    setReviews((prev) => [review, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Reviews & Feedback
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Share your experience with Apple A Day.
          </p>
        </div>

        <ReviewForm onSubmit={handleReviewSubmit} />

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Recent Reviews
          </h2>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg text-yellow-400">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">
                    {review.date}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;