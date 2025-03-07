import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { EventModalProps } from "@/types/calendar/eventModal";
import ColorPicker from "../colorPicker";
import TextArea from "../textArea";

const EventModal: React.FC<EventModalProps> = ({ isModalOpen, setIsModalOpen, isEditing, newEventData, setNewEventData, handleSaveEvent, handleDeleteEvent }) => {
    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalContent>
                <ModalHeader>{isEditing ? "Editar Evento" : "Ver Evento"}</ModalHeader>
                <ModalBody className="gap-4">
                    <Input label="Título del Evento" value={newEventData.title} onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })} />
                    <TextArea label="Descripción del Evento" maxLength={300} defaultValue={newEventData.description} onValueChange={(e) => setNewEventData({ ...newEventData, description: e })} />
                    <ColorPicker color={newEventData.color} onChange={(color) => setNewEventData({ ...newEventData, color })} />
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button color="secondary" onPress={handleSaveEvent}>{isEditing ? "Editar" : "Guardar"}</Button>
                    {isEditing && <Button color="danger" onPress={handleDeleteEvent}>Eliminar</Button>}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EventModal;