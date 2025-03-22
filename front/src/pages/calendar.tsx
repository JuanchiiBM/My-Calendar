import React, { useState, useEffect } from "react";
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
import { useGlobalContext } from "@/context/globalContext";
import SpinnerComponent from "@/components/spinner";
import Notifications from "@/components/calendar/notifications";
import useLogout from "@/hooks/useLogout";

const id_user = localStorage.getItem('userToken')
const name_user = localStorage.getItem('userName')

// Eliminar evento luego de crearlo
// Editar evento luego de crearlo

const Calendar = () => {
    const { theme, toggleTheme } = useThemeToggle();
    const { logout } = useLogout();
    const { spinner } = useGlobalContext()
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
        handleDeleteInvitation,
        setIsModalOpen,
        setNewEventData,
    } = useCalendarEvents(events, setEvents);

    useSetEvents(setEvents, `/api/events/?id=${id_user}`)

    useIconButtons();

    return (
        <main className="bg-background w-full flex flex-col min-h-screen items-center justify-center">
            {spinner && <SpinnerComponent />}
            <nav className="absolute flex items-end justify-end top-2 w-full">
            <Notifications />
            <Button isIconOnly variant="light" className="" onPress={toggleTheme}>
                <Icon icon={theme === "light" ? "lucide:moon" : "lucide:sun"} width={20} />
            </Button>
            <Button isIconOnly variant="light" className="" onPress={logout}>
                <Icon icon="fluent:arrow-exit-20-filled" width={20} />
            </Button>
            </nav>
            <h1 className="text-2xl sm:mt-0 mt-[100px] font-bold mb-4">Agenda de {name_user}</h1>
            <div className="w-full sm:w-[80%] min-h-screen">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={
                        window.innerWidth < 768
                            ? {
                                left: "",
                                center: "title",
                                right: "",
                            }
                            : {
                                left: "prev,next",
                                center: "title",
                                right: "addEventButton,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                            }
                    }

                    footerToolbar={
                        window.innerWidth < 768
                        ? {
                            left: "prev,next",
                            center: "",
                            right: "addEventButton,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                        }
                        : {}
                    }
                    
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
                handleDeleteInvitation={handleDeleteInvitation}
            />
        </main>
    );
};

export default Calendar;
