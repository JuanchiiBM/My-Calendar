import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import EventModal from "@/components/calendar/eventModal";
import useCalendarEvents from "@/hooks/calendar/useCalendarEvents";
import useIconButtons from "@/hooks/calendar/useIconButtons";
import useThemeToggle from "@/hooks/useThemeToggle";
import { EventInput } from "@fullcalendar/core/index.js";
import useSetEvents from "@/hooks/calendar/useSetEvents";

const id_user = localStorage.getItem('dataUser')

/*
 - Agregar validacion no - en crear nombre de usuario
 - Agregar spinner y en vez de usar localstorage usar context (Puta madre)
 - Agregar ruta de EventGuest para eliminar un evento al que te invitaron
 - Agregar validacion para no poder editar eventos que no sean propios
*/

const Calendar = () => {
    const { theme, toggleTheme } = useThemeToggle();
    const [events, setEvents] = useState<EventInput[]>([]);

    const {
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
    } = useCalendarEvents(events, setEvents);

    useSetEvents(setEvents, `/api/events/?id=${id_user}`)

    useIconButtons();

    return (
        <main className="bg-background w-full flex flex-col min-h-screen items-center justify-center p-4">
            <Button isIconOnly variant="light" className="absolute right-2 top-2" onPress={toggleTheme}>
                <Icon icon={theme === "light" ? "lucide:moon" : "lucide:sun"} width={20} />
            </Button>
            <h1 className="text-2xl font-bold mb-4">Mi Agenda</h1>
            <div className="w-[80%] min-h-screen">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "addEventButton,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    customButtons={{
                        addEventButton: {
                            text: "",
                            click: handleCreateEventClick,
                        },
                    }}
                    nowIndicator={true}
                    editable={true}
                    aspectRatio={2}
                    themeSystem="standard"
                    selectable={true}
                    locale={esLocale}
                    selectMirror={true}
                    dayMaxEvents={3}
                    events={events}
                    select={handleSelect}
                    dateClick={handleDateClick}
                    eventClick={handleEditEvent}
                    eventDrop={handleEventResizeAndDrop}
                    eventResize={handleEventResizeAndDrop}
                />
            </div>
            <EventModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isEditing={isEditing}
                newEventData={newEventData}
                setNewEventData={setNewEventData}
                handleSaveEvent={handleSaveEvent}
                handleDeleteEvent={handleDeleteEvent}
            />
        </main>
    );
};

export default Calendar;
