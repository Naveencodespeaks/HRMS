// src/types/notification.ts
export type NotificationType = 'NEW_CANDIDATE'

export interface NotificationGroupItem {
  label: string // e.g. "Software Developer"
  count: number // e.g. 6
} 

export interface NotificationSummary {
  type: NotificationType
  title: string // "14 new candidates applied"
  subtitle: string // "Today · Last 15 minutes"
  totalCount: number // 14
  groups: NotificationGroupItem[]
  hint?: string // "You have high application traffic."
}
