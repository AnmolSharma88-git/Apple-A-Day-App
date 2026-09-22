import { useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  Check,
  Clock3,
  Search,
  Users,
  X,
} from "lucide-react"

import {
  getAllBookings,
  updateBookingStatus,
} from "../../../services/bookingService"

import { BOOKING_STATUS } from "../../../constants/bookingStatus"

function CabinBooking() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getAllBookings()
        setBookings(data)
      } catch (error) {
        console.error(
          "Failed to load bookings:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  async function handleStatusChange(
    bookingId,
    newStatus
  ) {
    try {
      const updatedBooking =
        await updateBookingStatus(
          bookingId,
          newStatus
        )

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking
        )
      )
    } catch (error) {
      console.error(
        "Failed to update booking:",
        error
      )
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const search = searchTerm.toLowerCase()

      const matchesSearch =
        booking.userName
          ?.toLowerCase()
          .includes(search) ||
        booking.userEmail
          ?.toLowerCase()
          .includes(search) ||
        booking.purpose
          ?.toLowerCase()
          .includes(search) ||
        booking.id
          ?.toLowerCase()
          .includes(search)

      const matchesStatus =
        statusFilter === "ALL" ||
        booking.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [bookings, searchTerm, statusFilter])

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === BOOKING_STATUS.PENDING
  ).length

  const approvedCount = bookings.filter(
    (booking) =>
      booking.status === BOOKING_STATUS.APPROVED
  ).length

  const rejectedCount = bookings.filter(
    (booking) =>
      booking.status === BOOKING_STATUS.REJECTED
  ).length

  function getStatusStyle(status) {
    if (status === BOOKING_STATUS.APPROVED) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    }

    if (status === BOOKING_STATUS.REJECTED) {
      return "border-red-200 bg-red-50 text-red-700"
    }

    return "border-amber-200 bg-amber-50 text-amber-700"
  }

  function getInitials(name = "") {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  return (
    <section className="min-h-full space-y-6 bg-[#fbf9f5]">

      {/* Header */}
      <header className="rounded-2xl border border-[#e6e1d7] bg-[#f4efe6] px-5 py-6 sm:px-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708075]">
                  Operations
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-[#193528] sm:text-3xl">
                  Cabin Bookings
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736b]">
              Review and manage student requests for
              café cabins and meeting spaces.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#ded8cc] bg-white px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e9f0e9] text-[#315d45]">
              <CalendarDays size={17} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#908b82]">
                Total bookings
              </p>

              <p className="text-xl font-bold text-[#193528]">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#99948b]">
            Pending
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-700">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#99948b]">
            Approved
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#99948b]">
            Rejected
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e1dbd0] bg-[#fbf9f5] px-3.5 py-2.5">
            <Search
              size={17}
              className="shrink-0 text-[#9b978e]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by student, email, purpose or booking ID..."
              className="w-full bg-transparent text-sm text-[#393833] outline-none placeholder:text-[#aaa59b]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                label: "All",
                value: "ALL",
              },
              {
                label: "Pending",
                value: BOOKING_STATUS.PENDING,
              },
              {
                label: "Approved",
                value: BOOKING_STATUS.APPROVED,
              },
              {
                label: "Rejected",
                value: BOOKING_STATUS.REJECTED,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setStatusFilter(filter.value)
                }
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  statusFilter === filter.value
                    ? "bg-[#315d45] text-white"
                    : "bg-[#f7f3eb] text-[#706c64] hover:bg-[#eee9df]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d9e5da] border-t-[#315d45]" />

          <p className="mt-3 text-sm text-[#858078]">
            Loading cabin bookings...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        /* Empty */
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
            <CalendarDays size={22} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-[#59564f]">
            No bookings found
          </h2>

          <p className="mt-1 text-xs text-[#918d84]">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        /* Booking list */
        <div className="overflow-hidden rounded-2xl border border-[#e6e1d7] bg-white shadow-sm">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead className="border-b border-[#e6e1d7] bg-[#fbf9f5]">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[#858078]">
                    Student
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[#858078]">
                    Date & Time
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[#858078]">
                    People
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[#858078]">
                    Purpose
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[#858078]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[#858078]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-[#eeeae2] last:border-0 hover:bg-[#fdfbf7]"
                  >
                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9e5da] text-xs font-bold text-[#315d45]">
                          {getInitials(
                            booking.userName
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#393833]">
                            {booking.userName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#99948b]">
                            {booking.userEmail}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-[#aaa59b]">
                            {booking.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date/time */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="text-[#7d887f]"
                        />

                        <div>
                          <p className="text-sm font-semibold text-[#393833]">
                            {booking.date}
                          </p>

                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#99948b]">
                            <Clock3 size={12} />
                            {booking.startTime} -{" "}
                            {booking.endTime}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* People */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#393833]">
                        <Users
                          size={15}
                          className="text-[#7d887f]"
                        />
                        {booking.numberOfPeople}
                      </div>
                    </td>

                    {/* Purpose */}
                    <td className="max-w-xs px-5 py-4">
                      <p className="text-sm text-[#59564f]">
                        {booking.purpose}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      {booking.status ===
                        BOOKING_STATUS.PENDING ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                booking.id,
                                BOOKING_STATUS.APPROVED
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#315d45] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#274c39]"
                          >
                            <Check size={14} />
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                booking.id,
                                BOOKING_STATUS.REJECTED
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2dcd2] bg-white px-3 py-2 text-xs font-bold text-[#6b665e] transition hover:bg-[#f8f4ed]"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#aaa59b]">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="divide-y divide-[#eeeae2] lg:hidden">
            {filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9e5da] text-xs font-bold text-[#315d45]">
                      {getInitials(
                        booking.userName
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#393833]">
                        {booking.userName}
                      </p>

                      <p className="truncate text-xs text-[#99948b]">
                        {booking.userEmail}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#fbf9f5] p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#99948b]">
                      Date
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#393833]">
                      {booking.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#99948b]">
                      Time
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#393833]">
                      {booking.startTime} -{" "}
                      {booking.endTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#99948b]">
                      People
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#393833]">
                      <Users size={13} />
                      {booking.numberOfPeople}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#99948b]">
                      Booking ID
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#393833]">
                      {booking.id}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#99948b]">
                    Purpose
                  </p>

                  <p className="mt-1 text-sm text-[#59564f]">
                    {booking.purpose}
                  </p>
                </div>

                {booking.status ===
                  BOOKING_STATUS.PENDING && (
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          booking.id,
                          BOOKING_STATUS.APPROVED
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#315d45] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#274c39]"
                    >
                      <Check size={14} />
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          booking.id,
                          BOOKING_STATUS.REJECTED
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e2dcd2] bg-white px-3 py-2.5 text-xs font-bold text-[#6b665e] transition hover:bg-[#f8f4ed]"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default CabinBooking;