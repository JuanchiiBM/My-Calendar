import { useState } from "react";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import { EventProps, EventForCalendarEvents } from "@/types/eventModel";
import { POSTFunction, PUTFunction } from "@/utils/helpers/httpFunctions";
import useAlerts from "../useAlerts";

const id_user = parseInt(localStorage.getItem('dataUser') || '')

const useCalendarEvents = (events: EventInput[], setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [newEventData, setNewEventData] = useState<EventForCalendarEvents>({
        title: "",
        start: "",
        end: "",
        color: "#999999",
        description: "",
        category_id: 1,
        created_by: id_user,
        id_event: undefined,
        name_invited_user: undefined
    });

    const handleSelect = (info: any) => {
        setIsEditing(false);
        setNewEventData({
            title: "",
            description: "",
            start: info.startStr,
            end: info.endStr,
            color: "#999999",
            category_id: 1,
            id_event: undefined,
            name_invited_user: undefined
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
            color: "#999999",
            category_id: 1,
            created_by: id_user,
            id_event: undefined,
            name_invited_user: undefined
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
            color: "#999999",
            category_id: 1,
            id_event: undefined,
            created_by: id_user,
            name_invited_user: undefined
        });
        setIsModalOpen(true);
    };

    const handleEditEvent = (info: EventClickArg) => {
        setEditingEventId(info.event.id);
        setIsEditing(true);
        setIsModalOpen(true);
        console.log(info.event.extendedProps)
        console.log(info.event.startStr.slice(0, 16))
        setNewEventData({
            title: info.event.title,
            description: info.event.extendedProps.description || "",
            start: info.event.startStr.slice(0, 16),
            end: info.event.endStr.slice(0, 16),
            color: info.event.backgroundColor,
            id_event: info.event.extendedProps.id_event,
            category_id: info.event.extendedProps.category_id,
            created_by: info.event.extendedProps.created_by,
            name_invited_user: info.event.extendedProps.name_invited_user
        });
    };

    const handleDeleteEvent = () => {
        if (editingEventId) {
            console.log(events)
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== editingEventId));
            setIsModalOpen(false);
            setIsEditing(false);
            setEditingEventId(null);
        }
    };

    const handleSaveEvent = () => {
        if (isEditing && editingEventId) {
            handlePUTFunction(newEventData)
        } else {
            handlePOSTFunction(newEventData)
        }
    };

    const handleEventResizeAndDrop = (info: EventClickArg) => {
        handlePUTFunctionResizeAndDrop(newEventData, info)
    };

    const handleModifyDataObject = (_dataObject: EventForCalendarEvents) => {
        const _formattedDataObject: EventProps = {
            title: _dataObject.title,
            description: _dataObject.description,
            start_date: _dataObject.start,
            end_date: _dataObject.end,
            category_id: _dataObject.category_id,
            guests: _dataObject.name_invited_user,
            created_by: _dataObject.created_by
        }

        return _formattedDataObject
    }

    const handleSuccessPOST = () => {
        setEvents([...events, { id: Date.now().toString(), ...newEventData }]);
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingEventId(null);
    }

    //ARREGLAR NO ESTA FUNCIONANDO CORRECTAMENTE
    const handleSuccessPUTResizeAndDrop = (info: EventClickArg) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === info.event.id ? { ...event, start: info.event.startStr, end: info.event.endStr } : event
            )
        );
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingEventId(null);
    }

    const handleSuccessPUT = () => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === editingEventId ? { ...event, ...newEventData } : event
            )
        );
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingEventId(null);
    }

    const handleError = () => {
        setIsModalOpen(true);
    }

    const handlePUTFunction = async (_dataObject: EventForCalendarEvents) => {
        const _formattedDataObject = handleModifyDataObject(_dataObject)
        console.log(_dataObject)
        const response = await PUTFunction(`/api/events/?event_id=${_dataObject.id_event}`, _formattedDataObject)
        useAlerts(response, handleSuccessPUT, handleError)
    }

    const handlePUTFunctionResizeAndDrop = async (_dataObject: EventForCalendarEvents, info: EventClickArg) => {
        const _formattedDataObject = handleModifyDataObject(_dataObject)
        console.log(_dataObject)
        const response = await PUTFunction(`/api/events/?event_id=${_dataObject.id_event}`, _formattedDataObject)
        useAlerts(response, handleSuccessPUTResizeAndDrop(info), handleError)
    }

    const handlePOSTFunction = async (_dataObject: EventForCalendarEvents) => {
        const _formattedDataObject = handleModifyDataObject(_dataObject)
        const response = await POSTFunction(`/api/events`, _formattedDataObject)
        useAlerts(response, handleSuccessPOST, handleError)
    }

    return {
        newEventData,
        isModalOpen,
        isEditing,
        handleSelect,
        handleDateClick,
        handleCreateEventClick,
        handleEditEvent,
        handleDeleteEvent,
        handleSaveEvent,
        handleEventResizeAndDrop,
        setIsModalOpen,
        setNewEventData,
    };
};

export default useCalendarEvents