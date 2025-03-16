import { ErrorAlert } from "@/components/sweetsAlerts";
import { CategoryProps } from "@/types/categoryModels";
import { ResponseError } from "@/types/responseError";
import { GETFunction } from "@/utils/helpers/httpFunctions";
import { useState, useEffect } from "react";

const useSetCategorys = () => {
    const [categorys, setCategorys] = useState<CategoryProps[]>([]);

    const setCategorysFunction = async () => {
        try {
            const response: Array<CategoryProps> | ResponseError = await GETFunction("/api/categorys");
            if ('message' in response) {
                throw new Error(response.message);
            }
            setCategorys(response);
        } catch (error: any) {
            ErrorAlert('Error', error);
        }
    };

    useEffect(() => {
        setCategorysFunction();
    }, []);

    return categorys;
};

export default useSetCategorys;
