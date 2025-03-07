import React, { useEffect, useState, ReactDOM } from "react";
import { createRoot } from 'react-dom/client';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list"
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import ColorPicker from "@/components/colorPicker";
import TextArea from "@/components/textArea";
import {Icon} from "@iconify/react";
import {useTheme} from "@heroui/use-theme";


const Calendar = () => {
    const {theme, setTheme} = useTheme();
    
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    const [events, setEvents] = useState<Array<{
        id: string
        title: string,
        start: string,
        end: string,
        color: string,
        description: string
    }>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [eventsFromEndpoint, setEventsFromEndpoint] = useState<any>()
    const [newEventData, setNewEventData] = useState({
        title: "",
        start: "",
        end: "",
        color: "#3788d8",
        description: ""
    });


    const mapEventsFromEndpoint = () => {
        if (eventsFromEndpoint) {
            const mappedEvents = eventsFromEndpoint.map((eventData: any) => mapEndpointEvents(eventData));
            setEvents(mappedEvents);
        }
    }

    useEffect(() => {
        mapEventsFromEndpoint()
    }, [eventsFromEndpoint])

    const mapEndpointEvents = (eventData: any) => {
        if (eventData.age_fecha === eventData.age_fecha_fin) {
            const endDate = new Date(eventData.age_fecha);
            endDate.setMinutes(endDate.getMinutes() + 30);
            eventData.age_fecha_fin = endDate.toISOString();
        }
        return {
            id: eventData.age_id.toString(), // ID único
            title: eventData.age_titulo, // Título del evento
            start: eventData.age_fecha, // Fecha de inicio
            end: eventData.age_fecha_fin, // Fecha de fin
            color: eventData.TipoEvento.teveage_color || "#3788d8", // Color del evento
            description: eventData.age_descripcion || "", // Descripción del evento
            extendedProps: {
                tipoEvento: eventData.TipoEvento.teveage_nombre,
                prioridad: eventData.TipoPrioridad.tiprioage_nombre,
                perioricidad: eventData.TipoPerioricidad.tipperage_nombre,
                publico: eventData.age_publico,
            }
        };
    };

    const chargueFAIcons = () => {
        const addButton = document.getElementsByClassName('fc-addEventButton-button')[0]
        const listButton = document.getElementsByClassName('fc-listWeek-button')[0]

        const addButtonRoot = createRoot(addButton)
        const listButtonRoot = createRoot(listButton)

        addButtonRoot.render(<Icon icon={'mingcute:calendar-add-fill'} />)
        listButtonRoot.render(<Icon icon={'mingcute:calendar-2-fill'} />)

        addButton.setAttribute('title', 'Agregar evento')
        listButton.setAttribute('title', 'Vista de la lista de eventos')
    }

    useEffect(() => {
        chargueFAIcons()
    }, [])

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
        switch (info.view.type) {
            case "dayGridMonth":
                setNewEventData({
                    title: "",
                    description: "",
                    start: `${info.dateStr}T00:00`,
                    end: `${info.dateStr}T01:00`,
                    color: "#3788d8"
                });
                break;
            default:
                const date = new Date(info.dateStr);
                const endDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) + 30 * 60000);
                console.log(info.dateStr.length)
                if (info.dateStr.length === 10) {
                    setNewEventData({
                        title: "",
                        description: "",
                        start: `${info.dateStr}T00:00`,
                        end: `${info.dateStr}T23:59`,
                        color: "#3788d8"
                    });
                } else {
                    setNewEventData({
                        title: "",
                        description: "",
                        start: info.dateStr.slice(0, 16),
                        end: endDate.toISOString().slice(0, 16),
                        color: "#3788d8"
                    });
                }
                break;
        };
        setIsModalOpen(true);
    }

    const handleCreateEventClick = () => {
        setIsEditing(false);
        const now = new Date();
        const argentinaTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));

        console.log(argentinaTime.toISOString().slice(0, 16))
        setNewEventData({
            title: "",
            description: "",
            start: argentinaTime.toISOString().slice(0, 16),
            end: argentinaTime.toISOString().slice(0, 16),
            color: "#3788d8"
        });
        setIsModalOpen(true);
    };

    const handleEditEvent = (info: any) => {
        setEditingEventId(info.event.id);
        setIsEditing(true);
        setIsModalOpen(true);
        setNewEventData({
            title: info.event.title,
            description: info.event.extendedProps.description || "",
            start: info.event.startStr.slice(0, 16),
            end: info.event.endStr.slice(0, 16),
            color: info.event.backgroundColor || "#3788d8"
        });
    }

    const handleDeleteEvent = () => {
        if (editingEventId) {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== editingEventId)
            );
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
                        event.id === editingEventId
                            ? { ...event, ...newEventData }
                            : event
                    )
                );
            } else {
                setEvents([
                    ...events,
                    {
                        id: Date.now().toString(),
                        title: newEventData.title,
                        description: newEventData.description,
                        start: newEventData.start,
                        end: newEventData.end,
                        color: newEventData.color,
                    },
                ]);
            }

            setIsModalOpen(false);
            setIsEditing(false);
            setEditingEventId(null);
        }
    };

    const handleEventDrop = (info: any) => {
        const { id, startStr, endStr } = info.event;

        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === id
                    ? {
                        ...event,
                        start: startStr,
                        end: endStr,
                    }
                    : event
            )
        );
    };

    // ↔️ Manejar el cambio de duración (resize)
    const handleEventResize = (info: any) => {
        const { id, startStr, endStr } = info.event;

        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === id
                    ? {
                        ...event,
                        start: startStr,
                        end: endStr,
                    }
                    : event
            )
        );
    };

    return (
        <main className="bg-background w-full flex flex-col min-h-screen items-center justify-center p-4">
            <Button 
                isIconOnly 
                variant="light" 
                className="absolute right-2 top-2"
                onPress={toggleTheme}
                >
                <Icon 
                    icon={theme === "light" ? "lucide:moon" : "lucide:sun"} 
                    width={20} 
                />
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
                buttonText={{
                    list: ' '
                }}
                customButtons={{
                    addEventButton: {
                        text: '',
                        click: () => handleCreateEventClick()
                    }
                }}
                nowIndicator={true}
                editable={true}
                aspectRatio={2}
                themeSystem="standard"
                selectable={true}
                locale={esLocale}
                selectMirror={true}
                dayMaxEvents={3}
                events={events.map((event) => ({
                    ...event,
                    backgroundColor: event.color, // 🎨 Aplicar color de fondo
                    borderColor: event.color, // 🎨 Aplicar color de borde
                }))}
                select={handleSelect} // Selección de rango
                dateClick={handleDateClick} // Click en el calendario
                eventClick={(info: any) => handleEditEvent(info)} // Click en un evento
                eventDrop={handleEventDrop} // 🖱️ Evento arrastrado
                eventResize={handleEventResize} // ↔️ Evento redimensionado
            />
            </div>
            

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>{isEditing ? "Editar Evento" : "Ver Evento"}</ModalHeader>
                    <ModalBody className="gap-4">
                        <Input
                            label="Título del Evento"
                            placeholder="Escribe un título..." 
                            value={newEventData.title}
                            onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                        />
                        <TextArea
                            label="Descripción del Evento"
                            maxLength={300}
                            defaultValue={newEventData.description}
                            onValueChange={(e) =>
                                setNewEventData({ ...newEventData, description: e })
                            }
                        />
                        <div className="flex flex-row gap-4">
                            <Input
                                label="Fecha de Inicio"
                                type="datetime-local"
                                value={newEventData.start}
                                onChange={(e) => setNewEventData({ ...newEventData, start: e.target.value })}
                            />
                            <Input
                                label="Fecha de Fin"
                                type="datetime-local"
                                value={newEventData.end}
                                onChange={(e) => setNewEventData({ ...newEventData, end: e.target.value })}
                            />
                        </div>
                        <ColorPicker
                            color={newEventData.color}
                            onChange={(color) => setNewEventData({ ...newEventData, color })}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>                        
                        <Button color="secondary" onPress={() => handleSaveEvent()}>
                            {isEditing ? "Editar" : "Guardar"}
                        </Button>
                        {isEditing && (
                            <Button color="danger" onPress={handleDeleteEvent}>
                                Eliminar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </main>
    );
};





export default Calendar;
