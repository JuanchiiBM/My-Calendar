import { ErrorAlert, SuccessAlert } from "@/components/sweetsAlerts"
import { ResponsePropDefault } from "@/types/response"

const useAlerts = (response: ResponsePropDefault, successCallback?: any, errorCallback?: any) => {
    if (response.status == 'ok') {
        SuccessAlert(response.message, undefined, undefined, successCallback)
    } else if (response.error) {
        ErrorAlert('Error', response.error, undefined, errorCallback)
    }
}

export default useAlerts
