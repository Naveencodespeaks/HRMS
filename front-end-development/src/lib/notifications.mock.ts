// src/lib/notifications.mock.ts

/* =========================
   ADMIN NOTIFICATION SUMMARY
========================= */
export type AdminNotificationSummary = {
  totalCount: number
  unreadCount: number
}

export const adminNotificationSummaryMock: AdminNotificationSummary = {
  totalCount: 14,
  unreadCount: 6,
}

/* =========================
   ADMIN NOTIFICATION LIST
========================= */
export type AdminNotificationItem = {
  id: string
  name: string
  role: string
  experience: string
  appliedAt: string
  unread: boolean
}

export const adminNewCandidatesMock: AdminNotificationItem[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    role: 'Python Developer',
    experience: '3 Years',
    appliedAt: '2 mins ago',
    unread: true,
  },
  {
    id: '2',
    name: 'Anita Verma',
    role: 'Frontend Developer',
    experience: '2 Years',
    appliedAt: '10 mins ago',
    unread: true,
  },
  {
    id: '3',
    name: 'Suresh Kumar',
    role: 'DevOps Engineer',
    experience: '5 Years',
    appliedAt: '30 mins ago',
    unread: false,
  },
]
