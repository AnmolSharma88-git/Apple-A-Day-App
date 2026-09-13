import { useEffect, useMemo, useState } from "react"

import {
  Check,
  CheckCircle2,
  MessageSquare,
  Search,
  Send,
  Star,
  X,
} from "lucide-react"

import {
  getAllReviews,
  markReviewAsRead,
  markReviewAsUnread,
  replyToReview,
} from "../../../services/reviewService"

function Reviews() {
  const [reviews, setReviews] = useState([])

  const [search, setSearch] = useState("")

  const [ratingFilter, setRatingFilter] =
    useState("ALL")

  const [responseFilter, setResponseFilter] =
    useState("ALL")

  const [readFilter, setReadFilter] =
    useState("ALL")

  const [loading, setLoading] = useState(true)

  const [replyModalOpen, setReplyModalOpen] =
    useState(false)

  const [selectedReview, setSelectedReview] =
    useState(null)

  const [replyText, setReplyText] = useState("")

  const [sendingReply, setSendingReply] =
    useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      setLoading(true)

      const data = await getAllReviews()

      setReviews(data)
    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(review) {
    try {
      const updatedReview =
        await markReviewAsRead(review.id)

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.id === updatedReview.id
            ? updatedReview
            : item
        )
      )
    } catch (error) {
      console.error(
        "Failed to mark review as read:",
        error
      )
    }
  }

  async function handleMarkAsUnread(review) {
    try {
      const updatedReview =
        await markReviewAsUnread(review.id)

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.id === updatedReview.id
            ? updatedReview
            : item
        )
      )
    } catch (error) {
      console.error(
        "Failed to mark review as unread:",
        error
      )
    }
  }

  function openReplyModal(review) {
    setSelectedReview(review)

    setReplyText(
      review.adminReply || ""
    )

    setReplyModalOpen(true)
  }

  function closeReplyModal() {
    if (sendingReply) return

    setReplyModalOpen(false)
    setSelectedReview(null)
    setReplyText("")
  }

  async function handleReply() {
    if (!selectedReview) return

    if (!replyText.trim()) return

    try {
      setSendingReply(true)

      const updatedReview =
        await replyToReview(
          selectedReview.id,
          replyText
        )

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === updatedReview.id
            ? updatedReview
            : review
        )
      )

      setReplyModalOpen(false)
      setSelectedReview(null)
      setReplyText("")
    } catch (error) {
      console.error(
        "Failed to send reply:",
        error
      )
    } finally {
      setSendingReply(false)
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchText = search
        .toLowerCase()
        .trim()

      const matchesSearch =
        !searchText ||
        review.customer.name
          .toLowerCase()
          .includes(searchText) ||
        review.customer.email
          .toLowerCase()
          .includes(searchText) ||
        review.orderId
          .toLowerCase()
          .includes(searchText) ||
        review.comment
          .toLowerCase()
          .includes(searchText)

      const matchesRating =
        ratingFilter === "ALL" ||
        review.rating ===
          Number(ratingFilter)

      const matchesResponse =
        responseFilter === "ALL" ||
        (responseFilter === "REPLIED" &&
          review.replied) ||
        (responseFilter ===
          "NOT_REPLIED" &&
          !review.replied)

      const matchesRead =
        readFilter === "ALL" ||
        (readFilter === "READ" &&
          review.read) ||
        (readFilter === "UNREAD" &&
          !review.read)

      return (
        matchesSearch &&
        matchesRating &&
        matchesResponse &&
        matchesRead
      )
    })
  }, [
    reviews,
    search,
    ratingFilter,
    responseFilter,
    readFilter,
  ])

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0"

  const repliedCount = reviews.filter(
    (review) => review.replied
  ).length

  const unreadCount = reviews.filter(
    (review) => !review.read
  ).length

  const ratingDistribution = [
    5,
    4,
    3,
    2,
    1,
  ].map((rating) => {
    const count = reviews.filter(
      (review) =>
        review.rating === rating
    ).length

    const percentage =
      reviews.length > 0
        ? Math.round(
            (count / reviews.length) * 100
          )
        : 0

    return {
      rating,
      count,
      percentage,
    }
  })

  function renderStars(
    rating,
    size = 16
  ) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={size}
              fill={
                star <= rating
                  ? "currentColor"
                  : "none"
              }
              className={
                star <= rating
                  ? "text-amber-400"
                  : "text-stone-300"
              }
            />
          )
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm font-medium text-stone-500">
          Loading reviews...
        </p>
      </main>
    )
  }

  return (
    <>
      <main className="space-y-6">

        {/* Header */}
        <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b867e]">
              Customer feedback
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#193528]">
              Reviews
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage customer feedback and
              respond to reviews.
            </p>
          </div>

          {/* Compact Rating Card */}
          <div className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-[#dce6de] bg-[#f3f7f3] p-4 sm:flex-row sm:items-center">

            {/* Average */}
            <div className="flex min-w-[145px] items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dce9dd]">
                <Star
                  size={21}
                  fill="currentColor"
                  className="text-amber-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#66806d]">
                  Average rating
                </p>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xl font-bold text-[#193528]">
                    {averageRating}
                  </span>

                  <span className="text-xs text-stone-500">
                    / 5
                  </span>
                </div>

                <p className="text-[11px] text-stone-500">
                  {reviews.length} reviews
                </p>
              </div>

            </div>

            {/* Small Rating Distribution */}
            <div className="min-w-0 flex-1 space-y-1.5">

              {ratingDistribution.map(
                ({
                  rating,
                  percentage,
                  count,
                }) => (
                  <div
                    key={rating}
                    className="flex items-center gap-2"
                  >

                    <span className="flex w-6 items-center gap-0.5 text-[10px] font-semibold text-stone-500">
                      {rating}
                      <Star
                        size={9}
                        fill="currentColor"
                        className="text-amber-400"
                      />
                    </span>

                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#71927b]"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-5 text-right text-[10px] text-stone-400">
                      {count}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

        </section>

        {/* Small Status Summary */}
        <section className="grid gap-3 sm:grid-cols-3">

          <div className="rounded-xl border border-[#e4dfd5] bg-[#fffefa] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
              Total reviews
            </p>

            <p className="mt-1 text-lg font-bold text-[#193528]">
              {reviews.length}
            </p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
              Unread
            </p>

            <p className="mt-1 text-lg font-bold text-stone-800">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#dce6de] bg-[#f3f7f3] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#66806d]">
              Replied
            </p>

            <p className="mt-1 text-lg font-bold text-[#193528]">
              {repliedCount}
            </p>
          </div>

        </section>

        {/* Search + Dropdown Filters */}
        <section className="rounded-2xl border border-[#e4dfd5] bg-[#fffefa] p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-[1fr_170px_180px_170px]">

            {/* Search */}
            <div className="relative">

              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search customer, order or review..."
                className="w-full rounded-xl border border-[#ddd7cb] bg-[#f8f5ef] py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#7ca58a] focus:bg-white focus:ring-2 focus:ring-[#7ca58a]/20"
              />

            </div>

            {/* Rating */}
            <select
              value={ratingFilter}
              onChange={(event) =>
                setRatingFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-[#ddd7cb] bg-[#f8f5ef] px-4 py-3 text-sm font-medium text-stone-700 outline-none focus:border-[#7ca58a] focus:ring-2 focus:ring-[#7ca58a]/20"
            >
              <option value="ALL">
                All ratings
              </option>

              <option value="5">
                5 stars
              </option>

              <option value="4">
                4 stars
              </option>

              <option value="3">
                3 stars
              </option>

              <option value="2">
                2 stars
              </option>

              <option value="1">
                1 star
              </option>
            </select>

            {/* Response */}
            <select
              value={responseFilter}
              onChange={(event) =>
                setResponseFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-[#ddd7cb] bg-[#f8f5ef] px-4 py-3 text-sm font-medium text-stone-700 outline-none focus:border-[#7ca58a] focus:ring-2 focus:ring-[#7ca58a]/20"
            >
              <option value="ALL">
                All responses
              </option>

              <option value="REPLIED">
                Replied
              </option>

              <option value="NOT_REPLIED">
                Needs response
              </option>
            </select>

            {/* Read Status */}
            <select
              value={readFilter}
              onChange={(event) =>
                setReadFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-[#ddd7cb] bg-[#f8f5ef] px-4 py-3 text-sm font-medium text-stone-700 outline-none focus:border-[#7ca58a] focus:ring-2 focus:ring-[#7ca58a]/20"
            >
              <option value="ALL">
                All read status
              </option>

              <option value="UNREAD">
                Unread
              </option>

              <option value="READ">
                Read
              </option>
            </select>

          </div>

        </section>

        {/* Results count */}
        <div className="flex items-center justify-between">

          <p className="text-sm font-semibold text-stone-600">
            {filteredReviews.length}{" "}
            {filteredReviews.length === 1
              ? "review"
              : "reviews"}
          </p>

        </div>

        {/* Review Cards */}
        {filteredReviews.length > 0 ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredReviews.map(
              (review) => (
                <article
                  key={review.id}
                  className={`flex h-full flex-col rounded-2xl border bg-[#fffefa] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    !review.read
                      ? "border-amber-200"
                      : "border-[#e3ded4]"
                  }`}
                >

                  {/* Customer */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="relative">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dce8dd] text-sm font-bold text-[#31533f]">
                          {review.customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {!review.read && (
                          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-400" />
                        )}

                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate text-sm font-bold text-stone-900">
                          {review.customer.name}
                        </h2>

                        <p className="truncate text-xs text-stone-500">
                          {review.customer.email}
                        </p>

                      </div>

                    </div>

                    {/* Read status */}
                    {review.read ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-500">
                        <Check size={12} />
                        Read
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                        Unread
                      </span>
                    )}

                  </div>

                  {/* Rating */}
                  <div className="mt-5 flex items-center justify-between">

                    {renderStars(
                      review.rating
                    )}

                    <span className="text-xs text-stone-400">
                      {review.date}
                    </span>

                  </div>

                  {/* Order */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">

                    <span className="font-semibold text-stone-700">
                      Order
                    </span>

                    <span className="rounded-md bg-[#f3f1ec] px-2 py-1 font-semibold text-[#52705d]">
                      #{review.orderId}
                    </span>

                  </div>

                  {/* Review */}
                  <div className="mt-4 rounded-xl bg-[#f8f5ef] p-4">

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#7b867e]">
                      Customer review
                    </p>

                    <div className="flex gap-2">

                      <MessageSquare
                        size={16}
                        className="mt-0.5 shrink-0 text-[#789080]"
                      />

                      <p className="text-sm leading-6 text-stone-600">
                        "{review.comment}"
                      </p>

                    </div>

                  </div>

                  {/* Admin response */}
                  {review.replied && (
                    <div className="mt-3 rounded-xl border border-[#dce6de] bg-[#f1f6f1] p-4">

                      <div className="flex items-center justify-between">

                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#66806d]">
                          Admin response
                        </p>

                        <CheckCircle2
                          size={15}
                          className="text-emerald-600"
                        />

                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#486052]">
                        "{review.adminReply}"
                      </p>

                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-4">

                    {/* Read / unread */}
                    <button
                      type="button"
                      onClick={() =>
                        review.read
                          ? handleMarkAsUnread(
                              review
                            )
                          : handleMarkAsRead(
                              review
                            )
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#ddd7cb] bg-white px-3 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-[#f8f5ef] hover:text-[#31533f]"
                    >
                      <Check size={15} />

                      {review.read
                        ? "Mark Unread"
                        : "Mark as Read"}
                    </button>

                    {/* Reply */}
                    <button
                      type="button"
                      onClick={() =>
                        openReplyModal(
                          review
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1f4635] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285a44]"
                    >
                      <MessageSquare
                        size={15}
                      />

                      {review.replied
                        ? "Edit Response"
                        : "Reply"}
                    </button>

                  </div>

                </article>
              )
            )}

          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-[#d8d1c5] bg-[#fffefa] py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f1ec]">
              <MessageSquare
                size={21}
                className="text-stone-400"
              />
            </div>

            <h2 className="mt-4 text-base font-bold text-stone-800">
              No reviews found
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Try changing your search or
              filters.
            </p>

          </section>
        )}

      </main>

      {/* Reply Modal */}
      {replyModalOpen &&
        selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-2xl bg-[#fffefa] shadow-2xl">

              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">

                <div>

                  <h2 className="text-lg font-bold text-[#193528]">
                    {selectedReview.replied
                      ? "Edit Response"
                      : "Reply to Review"}
                  </h2>

                  <p className="mt-1 text-xs text-stone-500">
                    Responding to{" "}
                    <span className="font-semibold text-stone-700">
                      {
                        selectedReview
                          .customer
                          .name
                      }
                    </span>
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    closeReplyModal
                  }
                  disabled={
                    sendingReply
                  }
                  className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={20} />
                </button>

              </div>

              {/* Modal body */}
              <div className="space-y-5 p-6">

                {/* Original review */}
                <div className="rounded-xl bg-[#f8f5ef] p-4">

                  <div className="flex items-center justify-between gap-3">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7b867e]">
                      Customer review
                    </p>

                    {renderStars(
                      selectedReview.rating,
                      14
                    )}

                  </div>

                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    "{selectedReview.comment}"
                  </p>

                  <p className="mt-3 text-xs text-stone-400">
                    Order #
                    {
                      selectedReview.orderId
                    }
                  </p>

                </div>

                {/* Reply */}
                <div>

                  <label
                    htmlFor="adminReply"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Your response
                  </label>

                  <textarea
                    id="adminReply"
                    value={replyText}
                    onChange={(event) =>
                      setReplyText(
                        event.target.value
                      )
                    }
                    rows={5}
                    maxLength={500}
                    placeholder="Write a professional response to the customer..."
                    className="w-full resize-none rounded-xl border border-[#ddd7cb] bg-[#f8f5ef] px-4 py-3 text-sm leading-6 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#7ca58a] focus:bg-white focus:ring-2 focus:ring-[#7ca58a]/20"
                  />

                  <div className="mt-1 flex justify-end">
                    <span className="text-[11px] text-stone-400">
                      {replyText.length}
                      /500
                    </span>
                  </div>

                </div>

              </div>

              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-stone-100 px-6 py-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeReplyModal
                  }
                  disabled={
                    sendingReply
                  }
                  className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReply}
                  disabled={
                    sendingReply ||
                    !replyText.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f4635] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#285a44] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />

                  {sendingReply
                    ? "Sending..."
                    : selectedReview.replied
                      ? "Update Response"
                      : "Send Response"}
                </button>

              </div>

            </div>

          </div>
        )}
    </>
  )
}

export default Reviews;