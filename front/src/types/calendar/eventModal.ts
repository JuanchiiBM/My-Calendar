import { EventMidle } from "../eventModel";

export interface EventModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    isEditing: boolean;
    newEventData: {
        title: string;
        start: string;
        end: string;
        color: string;
        description: string;
    } & EventMidle;
    setNewEventData: React.Dispatch<React.SetStateAction<EventModalProps['newEventData']>>;
    handleSaveEvent: () => void;
    handleDeleteEvent: () => void;
    handleDeleteInvitation: () => void;
}