import { EventInput } from "@fullcalendar/core/index.js"
import useSet from "../useSet"
import { useEffect } from "react"
import { EventProps } from "@/types/eventModel"

const useSetEvents = (setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>, endpoint: string) => {
    const events = useSet(endpoint)

    const eventsFormatted: EventInput[] = events.map((ev: EventProps) => ({
        title: ev.title,
        description: ev.description,
        start: ev.start_date,
        end: ev.end_date,
        color: ev.color,
        category_id: ev.category_id,
        name_invited_user: ev.name_invited_user
    }))

    useEffect(() => {
        setEvents(eventsFormatted)
    }, [events])
}

export default useSetEvents
