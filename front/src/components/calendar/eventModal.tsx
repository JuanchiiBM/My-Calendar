import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DatePicker, Form } from "@heroui/react";
import ColorPicker from "../colorPicker";
import TextArea from "../textArea";
import { EventModalProps } from "@/types/calendar/eventModal";
import { I18nProvider } from "@react-aria/i18n";
import useFormatDateForPicker from "@/hooks/useFormatDateForPicker";
import errors from "@/config/eventModalErrors";
const EventModal: React.FC<EventModalProps> = ({ isModalOpen, setIsModalOpen, isEditing, newEventData, setNewEventData, handleSaveEvent, handleDeleteEvent }) => {
    const { formatDateForPicker } = useFormatDateForPicker()

    return (
        <I18nProvider locale="es">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>{isEditing ? "Editar Evento" : "Ver Evento"}</ModalHeader>
                    <ModalBody>
                        <Form className="w-full gap-4" id="event-form" onSubmit={(e) => {e.preventDefault(); handleSaveEvent()}}>
                            <Input label="Título del Evento" errorMessage={errors.title} value={newEventData.title} onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })} />
                            <TextArea label="Descripción del Evento" maxLength={300} defaultValue={newEventData.description} onValueChange={(e) => setNewEventData({ ...newEventData, description: e })} />
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <DatePicker 
                                    label="Fecha de Inicio" 
                                    showMonthAndYearPickers
                                    hideTimeZone
                                    maxValue={formatDateForPicker(newEventData.end)}
                                    value={formatDateForPicker(newEventData.start)} 
                                    onChange={(date) => date && setNewEventData({ ...newEventData, start: date.toString().slice(0, 16) })}
                                    validate={(value) => {
                                        if (new Date(newEventData.start) > new Date(newEventData.end)) {
                                            return errors.startDate2;
                                        } else if (!value) {
                                            return errors.startDate
                                        }
                                        return
                                    }}
                                />
                                <DatePicker 
                                    label="Fecha de Fin" 
                                    showMonthAndYearPickers
                                    hideTimeZone
                                    minValue={formatDateForPicker(newEventData.start)}
                                    value={formatDateForPicker(newEventData.end)} 
                                    onChange={(date) => date && setNewEventData({ ...newEventData, end: date.toString().slice(0, 16) })} 
                                    validate={(value) => {
                                        if (new Date(newEventData.start) > new Date(newEventData.end)) {
                                            return errors.startDate2;
                                        } else if (!value) {
                                            return errors.startDate
                                        }
                                        return
                                    }}
                                />
                            </div>
                            <ColorPicker color={newEventData.color} onChange={(color) => setNewEventData({ ...newEventData, color })} />
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button color="secondary" type="submit" form="event-form">{isEditing ? "Editar" : "Guardar"}</Button>
                        {isEditing && <Button color="danger" onPress={handleDeleteEvent}>Eliminar</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </I18nProvider>
    );
};

export default EventModal;
