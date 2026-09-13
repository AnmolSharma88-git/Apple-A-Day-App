import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  Check,
  Edit3,
  Megaphone,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react"

import {
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  toggleAnnouncementStatus,
  updateAnnouncement,
} from "../../../services/announcementService"

import { ANNOUNCEMENT_STATUS } from "../../../constants/announcementStatus"

import { ANNOUNCEMENT_AUDIENCE } from "../../../constants/announcementAudience"

function Announcements() {
  const [announcements, setAnnouncements] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("ALL")

  const [showModal, setShowModal] =
    useState(false)

  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null)

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data =
          await getAllAnnouncements()

        setAnnouncements(data)
      } catch (error) {
        console.error(
          "Failed to load announcements:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadAnnouncements()
  }, [])

  const filteredAnnouncements =
    useMemo(() => {
      return announcements.filter(
        (announcement) => {
          const search =
            searchTerm.toLowerCase()

          const matchesSearch =
            announcement.title
              ?.toLowerCase()
              .includes(search) ||
            announcement.message
              ?.toLowerCase()
              .includes(search)

          const matchesStatus =
            statusFilter === "ALL" ||
            announcement.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      announcements,
      searchTerm,
      statusFilter,
    ])

  async function handleSave(formData) {
    try {
      if (editingAnnouncement) {
        const updated =
          await updateAnnouncement(
            editingAnnouncement.id,
            formData
          )

        setAnnouncements(
          (currentAnnouncements) =>
            currentAnnouncements.map(
              (announcement) =>
                announcement.id ===
                updated.id
                  ? updated
                  : announcement
            )
        )
      } else {
        const created =
          await createAnnouncement(
            formData
          )

        setAnnouncements(
          (currentAnnouncements) => [
            created,
            ...currentAnnouncements,
          ]
        )
      }

      closeModal()
    } catch (error) {
      console.error(
        "Failed to save announcement:",
        error
      )
    }
  }

  async function handleDelete(
    announcementId
  ) {
    const shouldDelete =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      )

    if (!shouldDelete) {
      return
    }

    try {
      await deleteAnnouncement(
        announcementId
      )

      setAnnouncements(
        (currentAnnouncements) =>
          currentAnnouncements.filter(
            (announcement) =>
              announcement.id !==
              announcementId
          )
      )
    } catch (error) {
      console.error(
        "Failed to delete announcement:",
        error
      )
    }
  }

  async function handleToggleStatus(
    announcementId
  ) {
    try {
      const updated =
        await toggleAnnouncementStatus(
          announcementId
        )

      setAnnouncements(
        (currentAnnouncements) =>
          currentAnnouncements.map(
            (announcement) =>
              announcement.id ===
              updated.id
                ? updated
                : announcement
          )
      )
    } catch (error) {
      console.error(
        "Failed to update announcement:",
        error
      )
    }
  }

  function openCreateModal() {
    setEditingAnnouncement(null)
    setShowModal(true)
  }

  function openEditModal(announcement) {
    setEditingAnnouncement(announcement)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingAnnouncement(null)
  }

  function getStatusStyle(status) {
    if (
      status ===
      ANNOUNCEMENT_STATUS.PUBLISHED
    ) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    }

    return "border-stone-200 bg-stone-100 text-stone-600"
  }

  function getAudienceLabel(audience) {
    if (
      audience ===
      ANNOUNCEMENT_AUDIENCE.CUSTOMERS
    ) {
      return "Customers"
    }

    return "Everyone"
  }

  function formatDate(dateString) {
    return new Date(
      dateString
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const publishedCount =
    announcements.filter(
      (announcement) =>
        announcement.status ===
        ANNOUNCEMENT_STATUS.PUBLISHED
    ).length

  const draftCount =
    announcements.filter(
      (announcement) =>
        announcement.status ===
        ANNOUNCEMENT_STATUS.DRAFT
    ).length

  return (
    <section className="min-h-full space-y-6 bg-[#fbf9f5]">

      <header className="rounded-2xl border border-[#e6e1d7] bg-[#f4efe6] px-5 py-6 sm:px-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
                <Megaphone size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#708075]">
                  Engagement
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-[#193528] sm:text-3xl">
                  Announcements
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736b]">
              Share important updates and
              information with café users.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315d45] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#274c39]"
          >
            <Plus size={17} />
            New announcement
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#99948b]">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold text-[#193528]">
                {announcements.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4efe6] text-[#315d45]">
              <Bell size={18} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#99948b]">
            Published
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#99948b]">
            Drafts
          </p>

          <p className="mt-2 text-2xl font-bold text-stone-600">
            {draftCount}
          </p>
        </div>
      </div>

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
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search announcements..."
              className="w-full bg-transparent text-sm text-[#393833] outline-none placeholder:text-[#aaa59b]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setStatusFilter("ALL")
              }
              className={`rounded-lg px-3 py-2 text-xs font-bold ${
                statusFilter === "ALL"
                  ? "bg-[#315d45] text-white"
                  : "bg-[#f7f3eb] text-[#706c64]"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() =>
                setStatusFilter(
                  ANNOUNCEMENT_STATUS.PUBLISHED
                )
              }
              className={`rounded-lg px-3 py-2 text-xs font-bold ${
                statusFilter ===
                ANNOUNCEMENT_STATUS.PUBLISHED
                  ? "bg-[#315d45] text-white"
                  : "bg-[#f7f3eb] text-[#706c64]"
              }`}
            >
              Published
            </button>

            <button
              type="button"
              onClick={() =>
                setStatusFilter(
                  ANNOUNCEMENT_STATUS.DRAFT
                )
              }
              className={`rounded-lg px-3 py-2 text-xs font-bold ${
                statusFilter ===
                ANNOUNCEMENT_STATUS.DRAFT
                  ? "bg-[#315d45] text-white"
                  : "bg-[#f7f3eb] text-[#706c64]"
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d9e5da] border-t-[#315d45]" />

          <p className="mt-3 text-sm text-[#858078]">
            Loading announcements...
          </p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-[#e6e1d7] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#315d45]">
            <Bell size={22} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-[#59564f]">
            No announcements found
          </h2>

          <p className="mt-1 text-xs text-[#918d84]">
            Try changing your search or
            status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map(
            (announcement) => (
              <article
                key={announcement.id}
                className="rounded-2xl border border-[#e6e1d7] bg-white p-5 shadow-sm transition hover:border-[#c7d5c9] hover:shadow-md"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-[#193528]">
                        {announcement.title}
                      </h2>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                          announcement.status
                        )}`}
                      >
                        {announcement.status}
                      </span>
                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6f6b63]">
                      {announcement.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#908b82]">
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={14} />
                        {getAudienceLabel(
                          announcement.audience
                        )}
                      </span>

                      <span>
                        {formatDate(
                          announcement.createdAt
                        )}
                      </span>

                      <span className="text-[10px] font-semibold text-[#aaa59b]">
                        {announcement.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 xl:shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(
                          announcement.id
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ded8cc] bg-white px-3 py-2 text-xs font-bold text-[#5f5b54] transition hover:bg-[#f7f3eb]"
                    >
                      {announcement.status ===
                      ANNOUNCEMENT_STATUS.PUBLISHED ? (
                        <>
                          <X size={14} />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Publish
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(
                          announcement
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ded8cc] bg-white px-3 py-2 text-xs font-bold text-[#5f5b54] transition hover:bg-[#f7f3eb]"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          announcement.id
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {showModal && (
        <AnnouncementModal
          announcement={editingAnnouncement}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </section>
  )
}

function AnnouncementModal({
  announcement,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState(
    announcement?.title || ""
  )

  const [message, setMessage] =
    useState(
      announcement?.message || ""
    )

  const [audience, setAudience] =
    useState(
      announcement?.audience ||
        ANNOUNCEMENT_AUDIENCE.ALL
    )

  const [status, setStatus] =
    useState(
      announcement?.status ||
        ANNOUNCEMENT_STATUS.DRAFT
    )

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !title.trim() ||
      !message.trim()
    ) {
      return
    }

    onSave({
      title: title.trim(),
      message: message.trim(),
      audience,
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#e6e1d7] bg-[#fffdf9] shadow-xl">

        <div className="flex items-center justify-between border-b border-[#e6e1d7] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#193528]">
              {announcement
                ? "Edit announcement"
                : "New announcement"}
            </h2>

            <p className="mt-1 text-xs text-[#8d887f]">
              Share an update with café
              users.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#77736b] transition hover:bg-[#f4efe6]"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5f5b54]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Enter announcement title"
              className="w-full rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5f5b54]">
              Message
            </label>

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              rows={5}
              placeholder="Write your announcement..."
              className="w-full resize-none rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5f5b54]">
                Audience
              </label>

              <select
                value={audience}
                onChange={(event) =>
                  setAudience(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"
              >
                <option
                  value={
                    ANNOUNCEMENT_AUDIENCE.ALL
                  }
                >
                  Everyone
                </option>

                <option
                  value={
                    ANNOUNCEMENT_AUDIENCE.CUSTOMERS
                  }
                >
                  Customers
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5f5b54]">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#7c9b82] focus:ring-2 focus:ring-[#dce9de]"
              >
                <option
                  value={
                    ANNOUNCEMENT_STATUS.DRAFT
                  }
                >
                  Draft
                </option>

                <option
                  value={
                    ANNOUNCEMENT_STATUS.PUBLISHED
                  }
                >
                  Published
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#eeeae2] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#ded8cc] bg-white px-4 py-2.5 text-sm font-bold text-[#625f58] transition hover:bg-[#f7f3eb]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !title.trim() ||
                !message.trim()
              }
              className="rounded-xl bg-[#315d45] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#274c39] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {announcement
                ? "Save changes"
                : "Create announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Announcements;