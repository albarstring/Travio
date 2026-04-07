import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    
    <div>
      <h1></h1>
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> {/* redirect ke login */}
        <Route path = "/register" element={<Register/>}></Route>
        <Route path = "/login" element={<Login/>}></Route>
        <Route path = "/home" element={<Home/>}></Route>
      </Routes>
      <hr />
    </div>
  );
}

export default App;
