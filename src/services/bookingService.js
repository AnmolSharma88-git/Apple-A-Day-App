import { mockBookings } from "../mock/bookings"

export function getAllBookings() {
  return Promise.resolve([...mockBookings])
}

export function getBookingById(bookingId) {
  const booking = mockBookings.find(
    (booking) => booking.id === bookingId
  )

  return Promise.resolve(booking || null)
}

export function updateBookingStatus(
  bookingId,
  newStatus
) {
  const booking = mockBookings.find(
    (booking) => booking.id === bookingId
  )

  if (!booking) {
    return Promise.reject(
      new Error("Booking not found")
    )
  }

  booking.status = newStatus

  return Promise.resolve({
    ...booking,
  })
}