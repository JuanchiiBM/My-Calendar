import { FormEvent } from "react";
import { POSTFunction } from "@/utils/helpers/httpFunctions";
import { ErrorAlert, SuccessAlert } from "@/components/sweetsAlerts";
import { ResponsePropDefault } from "@/utils/interfaces/response";

const useHandleSubmit = () => {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, endpoint: string, title: {success: string, error: string}, callback?: () => void) => {
        e.preventDefault();
        const _dataObject = Object.fromEntries(new FormData(e.currentTarget))

        const response: ResponsePropDefault = await POSTFunction(endpoint, _dataObject);
        if (response.error) {
            ErrorAlert(title.error, response.error);
        } else {
            SuccessAlert(title.success, response.message, undefined, callback);
        }
    };

    return handleSubmit;
};

export default useHandleSubmit;
