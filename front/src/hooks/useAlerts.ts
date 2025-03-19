import { ErrorAlert, SuccessAlert } from "@/components/sweetsAlerts"
import { useGlobalContext } from "@/context/globalContext"
import { ResponsePropDefault } from "@/types/response"

const useAlerts = () => {
    const { setSpinner } = useGlobalContext();

    const handleAlerts = (response: ResponsePropDefault, successCallback?: any, errorCallback?: any) => {
        setSpinner(false);

        if (response.status == 'ok') {
            SuccessAlert(response.message, undefined, undefined, successCallback);
        } else if (response.error) {
            ErrorAlert('Error', response.error, undefined, errorCallback);
        }
    };

    return handleAlerts
};

export default useAlerts
