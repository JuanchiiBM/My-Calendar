import { Route, Routes } from "react-router-dom";

import AuthLogin from "@/pages/authLogin";
import Calendar from "./pages/calendar";

function App() {
  return (
    <Routes>
      <Route element={<AuthLogin />} path="/" />
      <Route element={<Calendar />} path="/calendar" />
    </Routes>
  );
}

export default App;
