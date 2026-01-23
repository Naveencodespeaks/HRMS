'use client'

import dynamic from 'next/dynamic'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'

/**
 * IMPORTANT:
 * FullCalendar MUST be dynamically imported with ssr:false
 */
const FullCalendar = dynamic(
  () => import('@fullcalendar/react'),
  { ssr: false }
)

export type InterviewEvent = {
  id: string
  title: string
  start: string
  end?: string
}

type Props = {
  interviews: InterviewEvent[]
  onSelectSlot?: (date: string) => void
}

export default function InterviewCalendar({
  interviews,
  onSelectSlot,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={interviews}
        selectable={Boolean(onSelectSlot)}
        select={(info) => {
          if (onSelectSlot) {
            onSelectSlot(
              dayjs(info.start).format('YYYY-MM-DDTHH:mm')
            )
          }
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }}
        height="auto"
      />
    </div>
  )
}
