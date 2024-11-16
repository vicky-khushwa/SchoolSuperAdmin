import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Controller/Home";
import School from "./Controller/School";
import LoginPage from "./Utility/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />}>
        <Route path="school" element={<School />} />
      </Route>
    </Routes>
  );
}

export default App;
