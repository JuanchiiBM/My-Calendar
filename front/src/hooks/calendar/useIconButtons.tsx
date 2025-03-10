import { useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import {Icon} from "@iconify/react";

let addButtonRoot: Root

const useIconButtons = () => {
    useEffect(() => {
        const addButton = document.getElementsByClassName("fc-addEventButton-button")[0];    
        addButtonRoot = createRoot(addButton)
    }, [])

    useEffect(() => {
        const addButton = document.getElementsByClassName("fc-addEventButton-button")[0];
        if (addButton) {
            addButtonRoot.render(<Icon icon={"mingcute:calendar-add-fill"} />);
            addButton.setAttribute("title", "Agregar evento");
        }
    }, [document.body.parentElement?.className]);
};

export default useIconButtons;
