import { useState } from "react";
import { EventClickArg, EventInput } from "@fullcalendar/core";

const useCalendarEvents = () => {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [newEventData, setNewEventData] = useState<{
        title: string,
        start: string,
        end: string,
        color: string,
        description: string
    }>({
        title: "",
        start: "",
        end: "",
        color: "#3788d8",
        description: ""
    });

    const handleSelect = (info: any) => {
        setIsEditing(false);
        setNewEventData({
            title: "",
            description: "",
            start: info.startStr,
            end: info.endStr,
            color: "#3788d8",
        });
        setIsModalOpen(true);
    };

    const handleDateClick = (info: any) => {
        setIsEditing(false);
        const now = new Date();
        const argentinaTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000 - 0 * 3600000);

        setNewEventData({
            title: "",
            description: "",
            start: `${info.dateStr}T${argentinaTime.toISOString().split('T')[1].slice(0, 5)}`,
            end: `${info.dateStr}T${new Date(argentinaTime.getTime() + 30 * 60000).toISOString().split('T')[1].slice(0, 5)}`,
            color: "#3788d8"
        });
        setIsModalOpen(true);
    };

    const handleCreateEventClick = () => {
        setIsEditing(false);
        const now = new Date();
        const argentinaTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000 - 0 * 3600000);

        setNewEventData({
            title: "",
            description: "",
            start: argentinaTime.toISOString().slice(0, 16),
            end: new Date(argentinaTime.getTime() + 30 * 60000).toISOString().slice(0, 16),
            color: "#3788d8"
        });
        setIsModalOpen(true);
    };

    const handleEditEvent = (info: EventClickArg) => {
        setEditingEventId(info.event.id);
        setIsEditing(true);
        setIsModalOpen(true);
        console.log(info.event.startStr)
        console.log(info.event.startStr.slice(0, 16))
        setNewEventData({
            title: info.event.title,
            description: info.event.extendedProps.description || "",
            start: info.event.startStr.slice(0, 16),
            end: info.event.endStr.slice(0, 16),
            color: info.event.backgroundColor || "#3788d8"
        });
    };

    const handleDeleteEvent = () => {
        if (editingEventId) {
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== editingEventId));
            setIsModalOpen(false);
            setIsEditing(false);
            setEditingEventId(null);
        }
    };

    const handleSaveEvent = () => {
        if (newEventData.title) {
            if (isEditing && editingEventId) {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === editingEventId ? { ...event, ...newEventData } : event
                    )
                );
            } else {
                setEvents([...events, { id: Date.now().toString(), ...newEventData }]);
            }

            setIsModalOpen(false);
            setIsEditing(false);
            setEditingEventId(null);
        }
    };

    const handleEventDrop = (info: any) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === info.event.id ? { ...event, start: info.event.startStr, end: info.event.endStr } : event
            )
        );
    };

    const handleEventResize = (info: any) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === info.event.id ? { ...event, start: info.event.startStr, end: info.event.endStr } : event
            )
        );
    };

    return {
        events,
        newEventData,
        isModalOpen,
        isEditing,
        handleSelect,
        handleDateClick,
        handleCreateEventClick,
        handleEditEvent,
        handleDeleteEvent,
        handleSaveEvent,
        handleEventDrop,
        handleEventResize,
        setIsModalOpen,
        setNewEventData,
    };
};

export default useCalendarEvents