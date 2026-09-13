import { mockAnnouncements } from "../mock/announcements"

export function getAllAnnouncements() {
  return Promise.resolve([...mockAnnouncements])
}

export function getAnnouncementById(
  announcementId
) {
  const announcement = mockAnnouncements.find(
    (announcement) =>
      announcement.id === announcementId
  )

  return Promise.resolve(
    announcement || null
  )
}

export function createAnnouncement(
  announcementData
) {
  const newAnnouncement = {
    ...announcementData,
    id: `ANN${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  mockAnnouncements.unshift(newAnnouncement)

  return Promise.resolve(newAnnouncement)
}

export function updateAnnouncement(
  announcementId,
  updates
) {
  const index = mockAnnouncements.findIndex(
    (announcement) =>
      announcement.id === announcementId
  )

  if (index === -1) {
    return Promise.reject(
      new Error("Announcement not found")
    )
  }

  mockAnnouncements[index] = {
    ...mockAnnouncements[index],
    ...updates,
  }

  return Promise.resolve({
    ...mockAnnouncements[index],
  })
}

export function deleteAnnouncement(
  announcementId
) {
  const index = mockAnnouncements.findIndex(
    (announcement) =>
      announcement.id === announcementId
  )

  if (index === -1) {
    return Promise.reject(
      new Error("Announcement not found")
    )
  }

  mockAnnouncements.splice(index, 1)

  return Promise.resolve()
}

export function toggleAnnouncementStatus(
  announcementId
) {
  const announcement = mockAnnouncements.find(
    (announcement) =>
      announcement.id === announcementId
  )

  if (!announcement) {
    return Promise.reject(
      new Error("Announcement not found")
    )
  }

  announcement.status =
    announcement.status === "PUBLISHED"
      ? "DRAFT"
      : "PUBLISHED"

  return Promise.resolve({
    ...announcement,
  })
}