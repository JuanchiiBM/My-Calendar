export interface EventProps {
    id_event?: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    created_by?: number;
    category_id: number;
    color?: string;
    guests?: Array<string>;
    id_user?: number;
    invited_user?: Array<number>;
    name_invited_user?: Array<string>;
}

import { EventInput } from "@fullcalendar/core/index.js";

export interface EventMidle
    extends
        Omit<EventProps, "title" | "description" | "start_date" | "end_date">,
        EventInput {
}

export interface EventForCalendarEvents extends EventMidle {
    title: string;
    start: string;
    end: string;
    color: string;
    description: string;
}
