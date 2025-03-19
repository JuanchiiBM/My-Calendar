import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DatePicker, Form, Autocomplete, AutocompleteItem } from "@heroui/react";
import TextArea from "../textArea";
import { EventModalProps } from "@/types/calendar/eventModal";
import { I18nProvider } from "@react-aria/i18n";
import useFormatDateForPicker from "@/hooks/useFormatDateForPicker";
import errors from "@/config/eventModalErrors";
import useSet from "@/hooks/useSet";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CategoryProps } from "@/types/categoryModels";

const id_user = localStorage.getItem('dataUser')

const EventModal: React.FC<EventModalProps> = ({ isModalOpen, setIsModalOpen, isEditing, newEventData, setNewEventData, handleSaveEvent, handleDeleteEvent, handleDeleteInvitation }) => {
    const { formatDateForPicker } = useFormatDateForPicker()
    const [guest, IsAGuest] = useState(false)
    const categorys: CategoryProps[] = useSet('/api/categorys')

    useEffect(() => {
        console.log(id_user)
        if (newEventData.created_by && newEventData.created_by.toString() != id_user?.toString()) {
            IsAGuest(true)
        } else {
            IsAGuest(false)
        }
    }, [isModalOpen])

    return (
        <I18nProvider locale="es">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>{guest ? "Ver Evento" : isEditing ? "Editar Evento" : "Ver Evento"}</ModalHeader>
                    <ModalBody>
                        <Form className="w-full gap-4" id="event-form" onSubmit={(e) => {e.preventDefault(); handleSaveEvent()}}>
                            <Input label="Título del Evento" errorMessage={errors.title} value={newEventData.title} onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })} isDisabled={guest} />
                            <TextArea label="Descripción del Evento" maxLength={300} defaultValue={newEventData.description} onValueChange={(e) => setNewEventData({ ...newEventData, description: e })} isDisabled={guest} />
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <DatePicker 
                                    label="Fecha de Inicio" 
                                    showMonthAndYearPickers
                                    hideTimeZone
                                    maxValue={formatDateForPicker(newEventData.end)}
                                    value={formatDateForPicker(newEventData.start)} 
                                    isDisabled={guest}
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
                                    isDisabled={guest}
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
                            <Autocomplete 
                                defaultSelectedKey={newEventData.color + '/' + newEventData.category_id} 
                                className="w-full" 
                                label="Selecciona una categoria"
                                isDisabled={guest}
                                onSelectionChange={(option) => {typeof option === 'string' && setNewEventData({ ...newEventData, category_id: parseInt(option.split('/')[1]), color: option.split('/')[0]})}}
                                startContent={<Icon icon="material-symbols:circle" style={{color: newEventData.color}} />}>
                                    {categorys.map((category) => (
                                    <AutocompleteItem 
                                        key={category.color + '/' + category.id_category}
                                        startContent={<Icon icon="material-symbols:circle" style={{color: category.color}} />}
                                    >{category.name}</AutocompleteItem>
                                    ))}
                            </Autocomplete>
                            <Input label="Invitados (Separelos con ' - ')"
                                isDisabled={guest}
                                value={newEventData.name_invited_user && newEventData.name_invited_user.join('-')}
                                onValueChange={(e) => {setNewEventData({ ...newEventData, name_invited_user: e.split('-')})}}
                            />
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button color="secondary" type="submit" form="event-form">{!guest && isEditing ? "Editar" : "Guardar"}</Button>
                        {(!guest && isEditing) ? <Button color="danger" onPress={handleDeleteEvent}>Eliminar</Button> : 
                        (guest && isEditing) && <Button color="danger" onPress={handleDeleteInvitation}>Eliminar Invitación</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </I18nProvider>
    );
};

export default EventModal;
