import { mockReviews } from "../mock/reviews"

export function getAllReviews() {
  return Promise.resolve([...mockReviews])
}

export function getReviewById(reviewId) {
  const review = mockReviews.find(
    (review) => review.id === reviewId
  )

  return Promise.resolve(review || null)
}

export function updateReview(reviewId, updates) {
  const index = mockReviews.findIndex(
    (review) => review.id === reviewId
  )

  if (index === -1) {
    return Promise.reject(
      new Error("Review not found")
    )
  }

  mockReviews[index] = {
    ...mockReviews[index],
    ...updates,
  }

  return Promise.resolve({
    ...mockReviews[index],
  })
}

export function markReviewAsRead(reviewId) {
  return updateReview(reviewId, {
    read: true,
  })
}

export function markReviewAsUnread(reviewId) {
  return updateReview(reviewId, {
    read: false,
  })
}

export function replyToReview(
  reviewId,
  adminReply
) {
  if (!adminReply.trim()) {
    return Promise.reject(
      new Error("Reply cannot be empty")
    )
  }

  const index = mockReviews.findIndex(
    (review) => review.id === reviewId
  )

  if (index === -1) {
    return Promise.reject(
      new Error("Review not found")
    )
  }

  mockReviews[index] = {
    ...mockReviews[index],

    // Opening/replying to a review means
    // the admin has seen it.
    read: true,

    replied: true,
    adminReply: adminReply.trim(),
    repliedAt: new Date().toISOString(),
  }

  return Promise.resolve({
    ...mockReviews[index],
  })
}