import { FormEvent } from "react";
import { POSTFunction } from "@/utils/helpers/httpFunctions";
import { ErrorAlert, SuccessAlert } from "@/components/sweetsAlerts";
import { ResponsePropDefault } from "@/types/response";
import { useGlobalContext } from "@/context/globalContext";

const useHandleSubmit = () => {
    const { setSpinner } = useGlobalContext()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, endpoint: string, title: {success: string, error: string}, callback?: () => void) => {
        e.preventDefault();
        const _dataObject = Object.fromEntries(new FormData(e.currentTarget))
        setSpinner(true)
        const response: ResponsePropDefault | any  = await POSTFunction(endpoint, _dataObject);
        if (response.error) {
            ErrorAlert(title.error, response.error);
        } else if (response.status == 'ok') {
            if (response.user) {
                localStorage.removeItem('userToken')
                localStorage.removeItem('userName')
                localStorage.setItem('userToken', response.user.userToken)
                localStorage.setItem('userName', response.user.name)
            }
            SuccessAlert(title.success, response.message, undefined, callback);
        } else {
            console.error(response)
        }
        setSpinner(false)
    };

    return handleSubmit;
};

export default useHandleSubmit;
