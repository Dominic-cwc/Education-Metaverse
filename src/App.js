import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./usrmain/Dashboard";
import { Card } from "@mui/material";

function App() {
  return (
    <Routes>
      <Route path="/Education-Metaverse/" element={<Login />} />
      <Route path="/Education-Metaverse/SignUp" element={<SignUp />} />
      <Route path="/Education-Metaverse/dashboard" element={<Dashboard />} />
      <Route path="/Education-Metaverse/Card" element={<Card />} />
      <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  );
}

export default App;
