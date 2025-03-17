import { parseAbsoluteToLocal } from "@internationalized/date";

const useFormatDateForPicker = () => {
    const formatDateForPicker = (date: string | undefined) => {
        if (!date) return undefined;
        try {
            return parseAbsoluteToLocal(new Date(date).toISOString());
        } catch {
            return undefined;
        }
    };

    return {formatDateForPicker}
};

export default useFormatDateForPicker;
