import { ErrorAlert } from "@/components/sweetsAlerts";
import { useGlobalContext } from "@/context/globalContext";
import { ResponsePropDefault } from "@/types/response";
import { GETFunction } from "@/utils/helpers/httpFunctions";
import { useState, useEffect } from "react";

const useSet = (endpoint: string) => {
    const {setSpinner} = useGlobalContext()
    const [value, setValue] = useState<any>([]);

    const setFunction = async () => {
        try {
            setSpinner(true)
            const response: ResponsePropDefault = await GETFunction(endpoint);
            if (response.error) {
                throw new Error(response.error);
            }
            setSpinner(false)
            setValue(response);
        } catch (error: any) {
            setSpinner(false)
            ErrorAlert('Error', error);
        }
    };

    useEffect(() => {
        setFunction();
    }, []);

    return value;
};

export default useSet;
