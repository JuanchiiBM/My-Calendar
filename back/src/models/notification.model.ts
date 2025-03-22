export interface NotificationProps {
    id_notification: number
    id_destination: number
    name_of_guests: string[]
    created_by: number
    created_at: string
    title: string
    message: string
    saw: boolean
}