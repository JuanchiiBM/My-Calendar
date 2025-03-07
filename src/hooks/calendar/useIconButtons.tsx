import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {Icon} from "@iconify/react";

const useIconButtons = () => {
    useEffect(() => {
        const addButton = document.getElementsByClassName("fc-addEventButton-button")[0];
        const listButton = document.getElementsByClassName("fc-listWeek-button")[0];

        if (addButton && listButton) {
            createRoot(addButton).render(<Icon icon={"mingcute:calendar-add-fill"} />);
            createRoot(listButton).render(<Icon icon={"mingcute:calendar-2-fill"} />);

            addButton.setAttribute("title", "Agregar evento");
            listButton.setAttribute("title", "Vista de la lista de eventos");
        }
    }, []);
};

export default useIconButtons;
