import React, { createContext, useContext } from "react";

interface GlobalContextProps {
    spinner: boolean
    setSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}


export const GlobalContext = createContext<GlobalContextProps>({
    spinner: false,
    setSpinner: () => {},
});

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
