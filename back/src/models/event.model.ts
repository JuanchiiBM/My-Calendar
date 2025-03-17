export interface EventProps {
    id_event: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    created_by: number
    category_id: number;
    guests?: Array<string>
    invited_user?: Array<number>
}
