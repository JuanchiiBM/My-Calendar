import { Route, Routes } from "react-router-dom";

import AuthLogin from "@/pages/authLogin";
import Calendar from "./pages/calendar";
import { useState } from "react";
import { GlobalContext } from "./context/globalContext";

function App() {
    const [spinner, setSpinner] = useState<boolean>(false)
  
    return (
      <GlobalContext.Provider value={{ 
          spinner: spinner, 
          setSpinner: setSpinner
          }}>
        <Routes>
            <Route element={<AuthLogin />} path="/" />
            <Route element={<Calendar />} path="/calendar" />
        </Routes>
    </GlobalContext.Provider>
  );
}

export default App;
