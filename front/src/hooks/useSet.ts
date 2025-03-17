import { ErrorAlert } from "@/components/sweetsAlerts";
import { ResponsePropDefault } from "@/types/response";
import { GETFunction } from "@/utils/helpers/httpFunctions";
import { useState, useEffect } from "react";

const useSet = (endpoint: string) => {
    const [value, setValue] = useState<any>([]);

    const setFunction = async () => {
        try {
            const response: ResponsePropDefault = await GETFunction(endpoint);
            if (response.error) {
                throw new Error(response.error);
            }
            setValue(response);
        } catch (error: any) {
            ErrorAlert('Error', error);
        }
    };

    useEffect(() => {
        setFunction();
    }, []);

    return value;
};

export default useSet;
